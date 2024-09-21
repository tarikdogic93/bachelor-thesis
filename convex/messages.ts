import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getMessages = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, { conversationId }) => {
    const user = await getCurrentUser(ctx);

    if (!user || !conversationId) {
      return [];
    }

    const existingConversation = await ctx.db.get(conversationId);

    if (!existingConversation) {
      return [];
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

    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", existingConversation._id),
      )
      .collect();

    const filteredMessages = messages.filter(
      (message) => !message.invisibleToIds.includes(user._id),
    );

    const filteredMessagesWithSender = await Promise.all(
      filteredMessages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);

        return {
          ...message,
          sender,
        };
      }),
    );

    return filteredMessagesWithSender;
  },
});

export const getMessagesInfo = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return { messagesNumber: 0, unseenMessagesNumber: 0 };
    }

    const existingConversation = await ctx.db.get(conversationId);

    if (!existingConversation) {
      return { messagesNumber: 0, unseenMessagesNumber: 0 };
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("byConversationId", (q) =>
        q.eq("conversationId", existingConversation._id),
      )
      .collect();

    const messagesNumber = messages.length;

    let unseenMessagesNumber = 0;

    if (
      existingConversation.participants.find(
        (participant) =>
          participant.userId === user._id && participant.status === "member",
      )
    ) {
      unseenMessagesNumber = messages.reduce((total, message) => {
        if (
          !message.isDeleted &&
          !message.invisibleToIds.includes(user._id) &&
          !message.seenByIds.includes(user._id)
        ) {
          return total + 1;
        }

        return total;
      }, 0);
    }

    return { messagesNumber, unseenMessagesNumber };
  },
});

export const createMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    text: v.string(),
  },
  handler: async (ctx, { conversationId, ...restArgs }) => {
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

    const otherUser = existingConversation.participants.find(
      (participant) => participant.userId !== user._id,
    );

    if (otherUser) {
      const presencePreferences = await ctx.db
        .query("presencePreferences")
        .withIndex("byUserId", (q) => q.eq("userId", otherUser.userId))
        .unique();

      if (presencePreferences && presencePreferences.doNotDisturb) {
        throw new ConvexError({
          message: "The user does not want to be disturbed.",
        });
      }
    }

    if (
      existingConversation.participants.filter((obj) => obj.status !== "member")
        .length > 0
    ) {
      const updatedParticipants = existingConversation.participants.map(
        (participant) => {
          if (participant.status !== "member") {
            return { userId: participant.userId, status: "member" };
          }

          return participant;
        },
      ) as { userId: Id<"users">; status: "member" | "pending" | "left" }[];

      await ctx.db.patch(existingConversation._id, {
        participants: updatedParticipants,
      });
    }

    const messageId = await ctx.db.insert("messages", {
      senderId: user._id,
      conversationId: existingConversation._id,
      isDeleted: false,
      likedByIds: [],
      invisibleToIds: [],
      seenByIds: [user._id],
      ...restArgs,
    });

    await ctx.db.patch(existingConversation._id, {
      messageIds: [...existingConversation.messageIds, messageId],
    });
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    text: v.string(),
  },
  handler: async (ctx, { messageId, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingMessage = await ctx.db.get(messageId);

    if (!existingMessage) {
      throw new ConvexError({
        message: "Message not found.",
      });
    }

    if (existingMessage.isDeleted) {
      throw new ConvexError({
        message: "Message was deleted.",
      });
    }

    if (existingMessage.senderId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(messageId, {
      updateTime: new Date().toISOString(),
      ...restArgs,
    });
  },
});

export const likeDislikeMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingMessage = await ctx.db.get(messageId);

    if (!existingMessage) {
      throw new ConvexError({
        message: "Message not found.",
      });
    }

    if (existingMessage.isDeleted) {
      throw new ConvexError({
        message: "Message was deleted.",
      });
    }

    if (existingMessage.senderId === user._id) {
      throw new ConvexError({
        message: "You cannot like your own message.",
      });
    }

    await ctx.db.patch(messageId, {
      likedByIds: existingMessage.likedByIds.includes(user._id)
        ? existingMessage.likedByIds.filter((userId) => userId !== user._id)
        : [...existingMessage.likedByIds, user._id],
    });
  },
});

export const markMessagesAsSeen = mutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, { messageIds }) => {
    const user = await getCurrentUserOrThrow(ctx);

    await Promise.all(
      messageIds.map(async (messageId) => {
        const existingMessage = await ctx.db.get(messageId);

        if (!existingMessage) {
          throw new ConvexError({ message: "Message not found." });
        }

        const existingConversation = await ctx.db.get(
          existingMessage.conversationId,
        );

        if (!existingConversation) {
          throw new ConvexError({ message: "Conversation not found." });
        }

        const isSeen = existingMessage.seenByIds.find(
          (userId) => userId === user._id,
        );

        if (!isSeen) {
          await ctx.db.patch(existingMessage._id, {
            seenByIds: [...existingMessage.seenByIds, user._id],
          });
        }
      }),
    );
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingMessage = await ctx.db.get(messageId);

    if (!existingMessage) {
      throw new ConvexError({
        message: "Message not found.",
      });
    }

    if (existingMessage.isDeleted) {
      throw new ConvexError({
        message: "Message already deleted.",
      });
    }

    if (existingMessage.senderId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(messageId, {
      isDeleted: true,
    });
  },
});
