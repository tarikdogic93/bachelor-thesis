import { ConvexError, v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getAchievements = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    const user = await getCurrentUser(ctx);

    let achievements: Doc<"achievements">[] = [];

    if (user) {
      if (userId) {
        achievements = await ctx.db
          .query("achievements")
          .withIndex("byUserId", (q) => q.eq("userId", userId))
          .collect();
      } else {
        achievements = await ctx.db
          .query("achievements")
          .withIndex("byUserId", (q) => q.eq("userId", user._id))
          .collect();
      }
    }

    return achievements;
  },
});

export const createAchievement = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("Academic"),
      v.literal("Professional"),
      v.literal("Personal"),
    ),
    date: v.string(),
    affiliatedWith: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Applicant");

    await ctx.db.insert("achievements", { ...args, userId: user._id });
  },
});

export const updateAchievement = mutation({
  args: {
    achievementId: v.id("achievements"),
    title: v.string(),
    category: v.union(
      v.literal("Academic"),
      v.literal("Professional"),
      v.literal("Personal"),
    ),
    date: v.string(),
    affiliatedWith: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { achievementId, description, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingAchievement = await ctx.db.get(achievementId);

    if (!existingAchievement) {
      throw new ConvexError({ message: "Achievement not found." });
    }

    if (existingAchievement.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingAchievement._id, {
      ...restArgs,
      description: description || undefined,
    });
  },
});

export const deleteAchievement = mutation({
  args: {
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, { achievementId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingAchievement = await ctx.db.get(achievementId);

    if (!existingAchievement) {
      throw new ConvexError({ message: "Achievement not found." });
    }

    if (existingAchievement.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingAchievement._id);
  },
});
