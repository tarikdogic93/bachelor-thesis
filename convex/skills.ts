import { ConvexError, v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getSkills = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    const user = await getCurrentUser(ctx);

    let skills: Doc<"skills">[] = [];

    if (user) {
      if (userId) {
        skills = await ctx.db
          .query("skills")
          .withIndex("byUserId", (q) => q.eq("userId", userId))
          .collect();
      } else {
        skills = await ctx.db
          .query("skills")
          .withIndex("byUserId", (q) => q.eq("userId", user._id))
          .collect();
      }
    }

    return skills;
  },
});

export const createSkill = mutation({
  args: {
    name: v.string(),
    rating: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Applicant");

    await ctx.db.insert("skills", { ...args, userId: user._id });
  },
});

export const updateSkill = mutation({
  args: {
    skillId: v.id("skills"),
    name: v.string(),
    rating: v.number(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, { skillId, description, ...restArgs }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingSkill = await ctx.db.get(skillId);

    if (!existingSkill) {
      throw new ConvexError({ message: "Skill not found." });
    }

    if (existingSkill.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingSkill._id, {
      ...restArgs,
      description: description || undefined,
    });
  },
});

export const deleteSkill = mutation({
  args: {
    skillId: v.id("skills"),
  },
  handler: async (ctx, { skillId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingSkill = await ctx.db.get(skillId);

    if (!existingSkill) {
      throw new ConvexError({ message: "Skill not found." });
    }

    if (existingSkill.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingSkill._id);
  },
});
