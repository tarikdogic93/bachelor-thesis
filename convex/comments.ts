import { ConvexError, v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";
import { checkIfThreadMember } from "./threads";

export const getComments = query({
  args: {
    postId: v.optional(v.id("posts")),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, { postId, parentCommentId }) => {
    const user = await getCurrentUser(ctx);

    if (!user || !postId) {
      return [];
    }

    const existingPost = await ctx.db.get(postId);

    if (!existingPost) {
      return [];
    }

    const existingThread = await ctx.db.get(existingPost.threadId);

    if (!existingThread) {
      return [];
    }

    if (user.role !== "Admin") {
      await checkIfThreadMember(existingThread, user._id);
    }

    if (parentCommentId) {
      const existingParentComment = await ctx.db.get(parentCommentId);

      if (!existingParentComment) {
        return [];
      }
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("byPostId_byParentCommentId", (q) =>
        q.eq("postId", existingPost._id).eq("parentCommentId", parentCommentId),
      )
      .collect();

    return comments;
  },
});

export const getCommentById = query({
  args: {
    commentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, { commentId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    if (!commentId) {
      return null;
    }

    const comment = await ctx.db.get(commentId);

    if (!comment) {
      return null;
    }

    const post = await ctx.db.get(comment.postId);

    if (!post) {
      return null;
    }

    const thread = await ctx.db.get(post.threadId);

    if (!thread) {
      return null;
    }

    if (user.role !== "Admin") {
      await checkIfThreadMember(thread, user._id);
    }

    return comment;
  },
});

export const getCommentsInfo = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return { commentsNumber: 0, unseenCommentsNumber: 0 };
    }

    const existingPost = await ctx.db.get(postId);

    if (!existingPost) {
      return { commentsNumber: 0, unseenCommentsNumber: 0 };
    }

    const existingThread = await ctx.db.get(existingPost.threadId);

    if (!existingThread) {
      return { commentsNumber: 0, unseenCommentsNumber: 0 };
    }

    if (user.role !== "Admin") {
      await checkIfThreadMember(existingThread, user._id);
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("byPostId_byParentCommentId", (q) =>
        q.eq("postId", existingPost._id),
      )
      .collect();

    const commenters = Array.from(
      new Set(comments.map((comment) => comment.userId)),
    );

    const commentsNumber = comments.length;

    let unseenCommentsNumber = 0;

    if (
      user.role !== "Admin" &&
      (existingThread.userId === user._id ||
        existingThread.memberIds?.includes(user._id)) &&
      commenters.includes(user._id)
    ) {
      unseenCommentsNumber = comments.reduce((total, comment) => {
        if (!comment.seenByIds.includes(user._id)) {
          return total + 1;
        }
        return total;
      }, 0);
    }

    return { commentsNumber, unseenCommentsNumber };
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    parentCommentId: v.optional(v.id("comments")),
    text: v.string(),
  },
  handler: async (ctx, { postId, parentCommentId, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingPost = await ctx.db.get(postId);

    if (!existingPost) {
      throw new ConvexError({ message: "Post not found." });
    }

    const existingThread = await ctx.db.get(existingPost.threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    await checkUserRole(user, "Applicant");

    await checkIfThreadMember(existingThread, user._id);

    await ctx.db.insert("comments", {
      userId: user._id,
      postId: existingPost._id,
      parentCommentId,
      numberOfReplies: 0,
      seenByIds: [user._id],
      ...restArgs,
    });

    if (parentCommentId) {
      const existingComment = await ctx.db.get(parentCommentId);

      if (!existingComment) {
        throw new ConvexError({ message: "Comment not found." });
      }

      await ctx.db.patch(parentCommentId, {
        numberOfReplies: existingComment.numberOfReplies + 1,
      });
    }
  },
});

export const updateComment = mutation({
  args: {
    commentId: v.id("comments"),
    text: v.string(),
  },
  handler: async (ctx, { commentId, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingComment = await ctx.db.get(commentId);

    if (!existingComment) {
      throw new ConvexError({ message: "Comment not found." });
    }

    const existingPost = await ctx.db.get(existingComment.postId);

    if (!existingPost) {
      throw new ConvexError({ message: "Post not found." });
    }

    const existingThread = await ctx.db.get(existingPost.threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    if (existingComment.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingComment._id, {
      ...restArgs,
      updateTime: new Date().toISOString(),
    });
  },
});

export const markCommentsAsSeen = mutation({
  args: { commentIds: v.array(v.id("comments")) },
  handler: async (ctx, { commentIds }) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user.role !== "Admin") {
      await Promise.all(
        commentIds.map(async (commentId) => {
          const existingComment = await ctx.db.get(commentId);

          if (!existingComment) {
            throw new ConvexError({ message: "Comment not found." });
          }

          const existingPost = await ctx.db.get(existingComment.postId);

          if (!existingPost) {
            throw new ConvexError({ message: "Post not found." });
          }

          const existingThread = await ctx.db.get(existingPost.threadId);

          if (!existingThread) {
            throw new ConvexError({ message: "Thread not found." });
          }

          await checkIfThreadMember(existingThread, user._id);

          const isSeen = existingComment.seenByIds.find(
            (userId) => userId === user._id,
          );

          if (!isSeen) {
            await ctx.db.patch(existingComment._id, {
              seenByIds: [...existingComment.seenByIds, user._id],
            });
          }
        }),
      );
    }
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, { commentId, parentCommentId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingComment = await ctx.db.get(commentId);

    if (!existingComment) {
      throw new ConvexError({ message: "Comment not found." });
    }

    if (user.role !== "Admin" && existingComment.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const deletedCommentIds: Id<"comments">[] = [];

    await ctx.db.delete(existingComment._id);

    deletedCommentIds.push(existingComment._id);

    await recursivelyDeleteComments(ctx, {
      parentCommentId: existingComment._id,
      deletedCommentIds,
    });

    if (parentCommentId) {
      const existingParentComment = await ctx.db.get(parentCommentId);

      if (!existingParentComment) {
        throw new ConvexError({ message: "Comment not found." });
      }

      await ctx.db.patch(parentCommentId, {
        numberOfReplies: existingParentComment.numberOfReplies - 1,
      });
    }

    return deletedCommentIds;
  },
});

const recursivelyDeleteComments = internalMutation({
  args: {
    parentCommentId: v.id("comments"),
    deletedCommentIds: v.array(v.id("comments")),
  },
  handler: async (ctx, { parentCommentId, deletedCommentIds }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("byParentCommentId", (q) =>
        q.eq("parentCommentId", parentCommentId),
      )
      .collect();

    await Promise.all(
      comments.map(async (comment) => {
        await ctx.db.delete(comment._id);

        deletedCommentIds.push(comment._id);

        await recursivelyDeleteComments(ctx, {
          parentCommentId: comment._id,
          deletedCommentIds,
        });
      }),
    );
  },
});
