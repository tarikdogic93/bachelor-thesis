import { ConvexError, v } from "convex/values";
import { PaginationResult, paginationOptsValidator } from "convex/server";

import { Doc } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getNotifications = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getCurrentUser(ctx);

    if (!user || user.role === "Admin") {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"notifications">>;
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(paginationOpts);

    return notifications;
  },
});

export const createPostsNotification = internalMutation({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db.query("threads").collect();

    await Promise.all(
      threads.map(async (thread) => {
        const memberIds = thread.memberIds;

        const posts = await ctx.db
          .query("posts")
          .withIndex("byThreadId", (q) => q.eq("threadId", thread._id))
          .collect();

        await Promise.all(
          memberIds.map(async (userId) => {
            const existingUser = await ctx.db.get(userId);

            if (existingUser) {
              const notificationPreferences = await ctx.db
                .query("notificationPreferences")
                .withIndex("byUserId", (q) => q.eq("userId", existingUser._id))
                .unique();

              if (
                !notificationPreferences ||
                notificationPreferences.receivePostNotifications
              ) {
                const existingNotification = await ctx.db
                  .query("notifications")
                  .withIndex("byUserId_byReferenceId", (q) =>
                    q
                      .eq("userId", existingUser._id)
                      .eq("referenceId", thread._id),
                  )
                  .unique();

                const unseenCount = posts.reduce((total, post) => {
                  if (!post.seenByIds.includes(userId)) {
                    return total + 1;
                  }

                  return total;
                }, 0);

                if (existingNotification) {
                  if (unseenCount > 0) {
                    if (existingNotification.unseenCount !== unseenCount) {
                      await ctx.db.patch(existingNotification._id, {
                        message: `You have ${unseenCount} new ${unseenCount === 1 ? "post" : "posts"} in thread '${thread.title}'.`,
                      });
                    }
                  } else {
                    await ctx.db.delete(existingNotification._id);
                  }
                } else {
                  if (unseenCount > 0) {
                    await ctx.db.insert("notifications", {
                      userId,
                      referenceId: thread._id,
                      unseenCount,
                      message: `You have ${unseenCount} new ${unseenCount === 1 ? "post" : "posts"} in thread '${thread.title}'.`,
                    });
                  }
                }
              }
            }
          }),
        );
      }),
    );
  },
});

export const createCommentsNotification = internalMutation({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    await Promise.all(
      posts.map(async (post) => {
        const existingThread = await ctx.db.get(post.threadId);

        if (existingThread) {
          const comments = await ctx.db
            .query("comments")
            .withIndex("byPostId", (q) => q.eq("postId", post._id))
            .collect();

          const commenters = Array.from(
            new Set(comments.map((comment) => comment.userId)),
          );

          await Promise.all(
            commenters.map(async (userId) => {
              const existingUser = await ctx.db.get(userId);

              if (
                existingUser &&
                existingThread.memberIds.includes(existingUser._id)
              ) {
                const notificationPreferences = await ctx.db
                  .query("notificationPreferences")
                  .withIndex("byUserId", (q) =>
                    q.eq("userId", existingUser._id),
                  )
                  .unique();

                if (
                  !notificationPreferences ||
                  notificationPreferences.receiveCommentNotifications
                ) {
                  const existingNotification = await ctx.db
                    .query("notifications")
                    .withIndex("byUserId_byReferenceId", (q) =>
                      q
                        .eq("userId", existingUser._id)
                        .eq("referenceId", post._id),
                    )
                    .unique();

                  const unseenCount = comments.reduce((total, comment) => {
                    if (!comment.seenByIds.includes(userId)) {
                      return total + 1;
                    }

                    return total;
                  }, 0);

                  if (existingNotification) {
                    if (unseenCount > 0) {
                      if (existingNotification.unseenCount !== unseenCount) {
                        await ctx.db.patch(existingNotification._id, {
                          message: `You have ${unseenCount} new ${unseenCount === 1 ? "comment" : "comments"} on post '${post.title}'.`,
                        });
                      }
                    } else {
                      await ctx.db.delete(existingNotification._id);
                    }
                  } else {
                    if (unseenCount > 0) {
                      await ctx.db.insert("notifications", {
                        userId,
                        referenceId: post._id,
                        unseenCount,
                        message: `You have ${unseenCount} new ${unseenCount === 1 ? "comment" : "comments"} on post '${post.title}'.`,
                      });
                    }
                  }
                }
              }
            }),
          );
        }
      }),
    );
  },
});

export const createMessagesNotification = internalMutation({
  args: {},
  handler: async (ctx) => {
    const conversations = await ctx.db.query("conversations").collect();

    await Promise.all(
      conversations.map(async (conversation) => {
        const messages = await ctx.db
          .query("messages")
          .withIndex("byConversationId", (q) =>
            q.eq("conversationId", conversation._id),
          )
          .collect();

        await Promise.all(
          conversation.participants.map(async ({ userId, status }) => {
            const existingUser = await ctx.db.get(userId);

            if (existingUser && status === "member") {
              const notificationPreferences = await ctx.db
                .query("notificationPreferences")
                .withIndex("byUserId", (q) => q.eq("userId", existingUser._id))
                .unique();

              if (
                !notificationPreferences ||
                notificationPreferences.receiveMessageNotifications
              ) {
                const existingNotification = await ctx.db
                  .query("notifications")
                  .withIndex("byUserId_byReferenceId", (q) =>
                    q
                      .eq("userId", existingUser._id)
                      .eq("referenceId", conversation._id),
                  )
                  .unique();

                const otherUserId =
                  conversation.type === "one-on-one"
                    ? conversation.participants.find(
                        (participant) =>
                          participant.userId !== existingUser._id,
                      )?.userId
                    : undefined;

                const otherUser = otherUserId
                  ? await ctx.db.get(otherUserId)
                  : undefined;

                const unseenCount = messages.reduce((total, message) => {
                  if (
                    !message.isDeleted &&
                    !message.invisibleToIds.includes(userId) &&
                    !message.seenByIds.includes(userId)
                  ) {
                    return total + 1;
                  }

                  return total;
                }, 0);

                if (existingNotification) {
                  if (unseenCount > 0) {
                    if (existingNotification.unseenCount !== unseenCount) {
                      await ctx.db.patch(existingNotification._id, {
                        message: `You have ${unseenCount} new ${unseenCount === 1 ? "message" : "messages"} ${conversation.type === "one-on-one" ? `from ${otherUser ? (otherUser.companyName ? otherUser.companyName : `${otherUser.firstName} ${otherUser.lastName}`) : "a user"}` : conversation.title ? `in group '${conversation.title}'` : "in a group"}.`,
                      });
                    }
                  } else {
                    await ctx.db.delete(existingNotification._id);
                  }
                } else {
                  if (unseenCount > 0) {
                    await ctx.db.insert("notifications", {
                      userId,
                      referenceId: conversation._id,
                      unseenCount,
                      message: `You have ${unseenCount} new ${unseenCount === 1 ? "message" : "messages"} ${conversation.type === "one-on-one" ? `from ${otherUser ? (otherUser.companyName ? otherUser.companyName : `${otherUser.firstName} ${otherUser.lastName}`) : "a user"}` : conversation.title ? `in group '${conversation.title}'` : "in a group"}.`,
                    });
                  }
                }
              }
            }
          }),
        );
      }),
    );
  },
});

export const clearNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingNotification = await ctx.db.get(notificationId);

    if (!existingNotification) {
      throw new Error("Notification not found.");
    }

    if (existingNotification.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(notificationId);
  },
});

export const clearAllNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUserOrThrow(ctx);

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .collect();

    await Promise.all(
      notifications.map(
        async (notification) => await ctx.db.delete(notification._id),
      ),
    );
  },
});
