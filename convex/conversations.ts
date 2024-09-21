import { ConvexError, v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getConversations = query({
  args: {
    type: v.union(v.literal("one-on-one"), v.literal("group")),
  },
  handler: async (ctx, { type }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const conversations = await ctx.db
      .query("conversations")
      .withIndex("byType", (q) => q.eq("type", type))
      .order("desc")
      .collect();

    const filteredConversations = conversations.filter((conversation) =>
      conversation.participants.find(
        (participant) => participant.userId === user._id,
      ),
    );

    const conversationsWithUsers = await Promise.all(
      filteredConversations.map(
        async (conversation) =>
          await getConversationWithUsers(ctx, conversation),
      ),
    );

    return conversationsWithUsers;
  },
});

export const createConversation = mutation({
  args: {
    type: v.union(v.literal("one-on-one"), v.literal("group")),
    title: v.optional(v.string()),
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, { userIds, type, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const conversationRolesOk = await conversationRolesCheck(
      ctx,
      user,
      userIds,
    );

    if (!conversationRolesOk) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const conversations = await ctx.db.query("conversations").collect();

    const existingConversation = conversations.find((conversation) =>
      [user._id, ...userIds].every((userId) =>
        conversation.participants.find(
          (participant) => participant.userId === userId,
        ),
      ),
    );

    let conversationWithUsers;

    if (existingConversation) {
      const userConversationStatus = existingConversation.participants.find(
        (participant) => participant.userId === user._id,
      )?.status;

      if (userConversationStatus && userConversationStatus !== "member") {
        const updatedParticipants = existingConversation.participants.map(
          (participant) => {
            if (participant.userId === user._id) {
              return { userId: participant.userId, status: "member" };
            }

            return participant;
          },
        ) as { userId: Id<"users">; status: "member" | "pending" | "left" }[];

        await ctx.db.patch(existingConversation._id, {
          participants: updatedParticipants,
        });
      }

      conversationWithUsers = await getConversationWithUsers(
        ctx,
        existingConversation,
      );
    } else {
      const conversationId = await ctx.db.insert("conversations", {
        ...restArgs,
        type,
        participants: [
          { userId: user._id, status: "member" },
          ...userIds.map((userId) => {
            return { userId, status: "pending" } as {
              userId: Id<"users">;
              status: "member" | "pending" | "left";
            };
          }),
        ],
        messageIds: [],
      });

      const conversation = await ctx.db.get(conversationId);

      if (conversation) {
        conversationWithUsers = await getConversationWithUsers(
          ctx,
          conversation,
        );
      }
    }

    return conversationWithUsers;
  },
});

export const leaveConversation = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingConversation = await ctx.db.get(conversationId);

    if (!existingConversation) {
      throw new ConvexError({
        message: "Conversation not found.",
      });
    }

    if (
      !existingConversation.participants.find(
        (participant) =>
          participant.userId === user._id && participant.status === "member",
      )
    ) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    if (
      existingConversation.participants.filter(
        (participant) => participant.status === "member",
      ).length === 1
    ) {
      await ctx.db.delete(conversationId);

      await Promise.all(
        existingConversation.messageIds.map(async (messageId) => {
          const existingMessage = await ctx.db.get(messageId);

          if (existingMessage) {
            await ctx.db.delete(messageId);
          }
        }),
      );
    } else {
      const updatedParticipants = existingConversation.participants.map(
        (participant) => {
          if (participant.userId === user._id) {
            return { userId: participant.userId, status: "left" };
          }

          return participant;
        },
      ) as { userId: Id<"users">; status: "member" | "pending" | "left" }[];

      await ctx.db.patch(conversationId, {
        participants: updatedParticipants,
      });

      await Promise.all(
        existingConversation.messageIds.map(async (messageId) => {
          const existingMessage = await ctx.db.get(messageId);

          if (existingMessage) {
            await ctx.db.patch(existingMessage._id, {
              invisibleToIds: [...existingMessage.invisibleToIds, user._id],
            });
          }
        }),
      );
    }
  },
});

async function conversationRolesCheck(
  ctx: QueryCtx,
  user: Doc<"users">,
  userIds: Doc<"users">["_id"][],
) {
  if (userIds.includes(user._id)) {
    return false;
  }

  const userRoles = (await Promise.all(
    userIds.map(async (userId) => {
      const user = await ctx.db.get(userId);

      if (user && user.role) {
        return user.role;
      }
    }),
  )) as Exclude<Doc<"users">["role"], undefined>[];

  switch (user.role) {
    case "Admin":
      return userRoles.every((role) => role === "Admin");
    case "Applicant":
    case "Company":
      return userRoles.every(
        (role) => role === "Applicant" || role === "Company",
      );
    default:
      return false;
  }
}

async function getConversationWithUsers(
  ctx: QueryCtx,
  conversation: Doc<"conversations">,
) {
  const users = await Promise.all(
    conversation.participants.map(async (participant) => {
      const user = await ctx.db.get(participant.userId);

      return user;
    }),
  );

  return {
    ...conversation,
    users,
  };
}
