import { ConvexError, v } from "convex/values";
import { PaginationResult, paginationOptsValidator } from "convex/server";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";
import { checkIfThreadMember } from "./threads";

export const getPosts = query({
  args: {
    threadId: v.optional(v.id("threads")),
    searchText: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { threadId, searchText, paginationOpts }) => {
    const user = await getCurrentUser(ctx);

    if (!user || !threadId) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"posts">>;
    }

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"posts">>;
    }

    if (user.role !== "Admin") {
      await checkIfThreadMember(existingThread, user._id);
    }

    let posts: PaginationResult<Doc<"posts">>;

    if (searchText) {
      posts = await ctx.db
        .query("posts")
        .withSearchIndex("searchTitle", (q) =>
          q.search("title", searchText).eq("threadId", threadId),
        )
        .paginate(paginationOpts);
    } else {
      posts = await ctx.db
        .query("posts")
        .withIndex("byThreadId", (q) => q.eq("threadId", existingThread._id))
        .order("desc")
        .paginate(paginationOpts);
    }

    return posts;
  },
});

export const getPostsInfo = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return { postsNumber: 0, unseenPostsNumber: 0 };
    }

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      return { postsNumber: 0, unseenPostsNumber: 0 };
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("byThreadId", (q) => q.eq("threadId", existingThread._id))
      .collect();

    const postsNumber = posts.length;

    let unseenPostsNumber = 0;

    if (
      user.role !== "Admin" &&
      (existingThread.userId === user._id ||
        existingThread.memberIds?.includes(user._id))
    ) {
      unseenPostsNumber = posts.reduce((total, post) => {
        if (!post.seenByIds.includes(user._id)) {
          return total + 1;
        }

        return total;
      }, 0);
    }

    return { postsNumber, unseenPostsNumber };
  },
});

export const createPost = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    await checkUserRole(user, "Applicant");

    await checkIfThreadMember(existingThread, user._id);

    await ctx.db.insert("posts", {
      userId: user._id,
      threadId: existingThread._id,
      votes: [],
      seenByIds: [user._id],
      ...restArgs,
    });
  },
});

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    content: v.optional(v.string()),
  },
  handler: async (ctx, { postId, content, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingPost = await ctx.db.get(postId);

    if (!existingPost) {
      throw new ConvexError({ message: "Post not found." });
    }

    if (existingPost.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingPost._id, {
      ...restArgs,
      updateTime: new Date().toISOString(),
      content: content || undefined,
    });
  },
});

export const submitPostVote = mutation({
  args: {
    postId: v.id("posts"),
    value: v.union(v.literal("up"), v.literal("down")),
  },
  handler: async (ctx, { postId, value }) => {
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

    const voteIndex = existingPost.votes.findIndex(
      (vote) => vote.userId === user._id,
    );

    if (voteIndex !== -1) {
      const oldValue = existingPost.votes[voteIndex].value;

      if (oldValue === value) {
        throw new ConvexError({
          message: "Your vote remains unchanged.",
        });
      }

      existingPost.votes[voteIndex].value = value;
    } else {
      existingPost.votes.push({
        userId: user._id,
        value,
      });
    }

    await ctx.db.patch(existingPost._id, {
      votes: existingPost.votes,
    });
  },
});

export const markPostsAsSeen = mutation({
  args: { postIds: v.array(v.id("posts")) },
  handler: async (ctx, { postIds }) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user.role !== "Admin") {
      await Promise.all(
        postIds.map(async (postId) => {
          const existingPost = await ctx.db.get(postId);

          if (!existingPost) {
            throw new ConvexError({ message: "Post not found." });
          }

          const existingThread = await ctx.db.get(existingPost.threadId);

          if (!existingThread) {
            throw new ConvexError({ message: "Thread not found." });
          }

          await checkIfThreadMember(existingThread, user._id);

          const isSeen = existingPost.seenByIds.find(
            (userId) => userId === user._id,
          );

          if (!isSeen) {
            await ctx.db.patch(existingPost._id, {
              seenByIds: [...existingPost.seenByIds, user._id],
            });
          }
        }),
      );
    }
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingPost = await ctx.db.get(postId);

    if (!existingPost) {
      throw new ConvexError({ message: "Post not found." });
    }

    if (user.role !== "Admin" && existingPost.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingPost._id);

    const comments = await ctx.db
      .query("comments")
      .withIndex("byPostId", (q) => q.eq("postId", existingPost._id))
      .collect();

    await Promise.all(
      comments.map(async (comment) => {
        await ctx.db.delete(comment._id);
      }),
    );
  },
});
