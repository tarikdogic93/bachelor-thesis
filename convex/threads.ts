import { ConvexError, v } from "convex/values";
import { paginationOptsValidator, PaginationResult } from "convex/server";

import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";
import { Doc, Id } from "./_generated/dataModel";

export const getThreads = query({
  args: {
    searchText: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { searchText, paginationOpts }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"threads">>;
    }

    let threads: PaginationResult<Doc<"threads">>;

    if (searchText) {
      threads = await ctx.db
        .query("threads")
        .withSearchIndex("searchTitle", (q) => q.search("title", searchText))
        .paginate(paginationOpts);
    } else {
      threads = await ctx.db
        .query("threads")
        .order("desc")
        .paginate(paginationOpts);
    }

    const threadsWithImages = threads;

    threadsWithImages.page = await Promise.all(
      threads.page.map(async (thread) => ({
        ...thread,
        ...(thread.image && {
          image: {
            name: thread.image.name,
            type: thread.image.type,
            url: (await ctx.storage.getUrl(thread.image.url)) as Id<"_storage">,
          },
        }),
      })),
    );

    return threadsWithImages;
  },
});

export const createThread = mutation({
  args: {
    title: v.string(),
    image: v.optional(
      v.object({
        name: v.string(),
        type: v.string(),
        url: v.id("_storage"),
      }),
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Applicant");

    await ctx.db.insert("threads", {
      ...args,
      userId: user._id,
      memberIds: [user._id],
    });
  },
});

export const updateThread = mutation({
  args: {
    threadId: v.id("threads"),
    title: v.string(),
    image: v.optional(
      v.object({
        name: v.string(),
        type: v.string(),
        url: v.id("_storage"),
      }),
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { threadId, image, description, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    if (existingThread.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingThread._id, {
      ...restArgs,
      updateTime: new Date().toISOString(),
      image: image ? image : existingThread.image,
      description: description || undefined,
    });
  },
});

export const removeThreadImage = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    if (existingThread.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    if (existingThread.image) {
      const existingImageInStorage = await ctx.storage.getUrl(
        existingThread.image.url,
      );

      if (!existingImageInStorage) {
        throw new ConvexError({ message: "Image not found in storage." });
      }

      await ctx.storage.delete(existingThread.image.url);

      await ctx.db.patch(existingThread._id, {
        image: undefined,
      });
    }
  },
});

export const joinThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user.role === "Admin") {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    if (existingThread.memberIds?.includes(user._id)) {
      throw new ConvexError({
        message: "You are already a member of this thread.",
      });
    }

    const prevMemberIds = existingThread.memberIds || [];

    await ctx.db.patch(existingThread._id, {
      memberIds: [...prevMemberIds, user._id],
    });
  },
});

export const leaveThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user.role === "Admin") {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    await checkIfThreadMember(existingThread, user._id);

    if (existingThread.userId === user._id) {
      throw new ConvexError({
        message: "You can't leave a thread you created.",
      });
    }

    await ctx.db.patch(existingThread._id, {
      memberIds: existingThread.memberIds.filter(
        (memberId) => memberId !== user._id,
      ),
    });

    const posts = await ctx.db
      .query("posts")
      .withIndex("byThreadId", (q) => q.eq("threadId", existingThread._id))
      .collect();

    await Promise.all(
      posts.map(async (post) => {
        if (post.userId !== user._id && post.seenByIds.includes(user._id)) {
          await ctx.db.patch(post._id, {
            seenByIds: post.seenByIds.filter((userId) => userId !== user._id),
          });
        }

        const comments = await ctx.db
          .query("comments")
          .withIndex("byPostId", (q) => q.eq("postId", post._id))
          .collect();

        await Promise.all(
          comments.map(async (comment) => {
            if (
              comment.userId !== user._id &&
              comment.seenByIds.includes(user._id)
            ) {
              await ctx.db.patch(comment._id, {
                seenByIds: comment.seenByIds.filter(
                  (userId) => userId !== user._id,
                ),
              });
            }
          }),
        );
      }),
    );
  },
});

export const deleteThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, { threadId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingThread = await ctx.db.get(threadId);

    if (!existingThread) {
      throw new ConvexError({ message: "Thread not found." });
    }

    if (existingThread.userId !== user._id && user.role !== "Admin") {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingThread._id);

    if (existingThread.image) {
      await ctx.storage.delete(existingThread.image.url);
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("byThreadId", (q) => q.eq("threadId", existingThread._id))
      .collect();

    await Promise.all(
      posts.map(async (post) => {
        await ctx.db.delete(post._id);

        const comments = await ctx.db
          .query("comments")
          .withIndex("byPostId", (q) => q.eq("postId", post._id))
          .collect();

        await Promise.all(
          comments.map(async (comment) => {
            await ctx.db.delete(comment._id);
          }),
        );
      }),
    );
  },
});

export async function checkIfThreadMember(
  thread: Doc<"threads">,
  userId: Id<"users">,
) {
  if (thread.userId !== userId && !thread.memberIds?.includes(userId)) {
    throw new ConvexError({
      message: "You are not a member of this thread.",
    });
  }
}
