import { ConvexError, v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getExperiences = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, { userId }) => {
    const user = await getCurrentUser(ctx);

    let experiences: Doc<"experiences">[] = [];

    if (user) {
      if (userId) {
        experiences = await ctx.db
          .query("experiences")
          .withIndex("byUserId", (q) => q.eq("userId", userId))
          .collect();
      } else {
        experiences = await ctx.db
          .query("experiences")
          .withIndex("byUserId", (q) => q.eq("userId", user._id))
          .collect();
      }
    }

    return experiences;
  },
});

export const createExperience = mutation({
  args: {
    title: v.string(),
    establishment: v.string(),
    category: v.union(
      v.literal("Education"),
      v.literal("Certification"),
      v.literal("Competition"),
      v.literal("Internship"),
      v.literal("Volunteer"),
      v.literal("Freelance"),
      v.literal("Work"),
      v.literal("Research"),
      v.literal("Entrepreneurial"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Applicant");

    await ctx.db.insert("experiences", { ...args, userId: user._id });
  },
});

export const updateExperience = mutation({
  args: {
    experienceId: v.id("experiences"),
    title: v.string(),
    establishment: v.string(),
    category: v.union(
      v.literal("Education"),
      v.literal("Certification"),
      v.literal("Competition"),
      v.literal("Internship"),
      v.literal("Volunteer"),
      v.literal("Freelance"),
      v.literal("Work"),
      v.literal("Research"),
      v.literal("Entrepreneurial"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      experienceId,
      endDate,
      isOngoing,
      country,
      city,
      settingType,
      description,
      ...restArgs
    },
  ) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingExperience = await ctx.db.get(experienceId);

    if (!existingExperience) {
      throw new ConvexError({ message: "Experience not found." });
    }

    if (existingExperience.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(existingExperience._id, {
      ...restArgs,
      endDate: isOngoing ? undefined : endDate,
      isOngoing,
      country: settingType === "Remote" ? undefined : country,
      city: settingType === "Remote" ? undefined : city,
      settingType,
      description: description || undefined,
    });
  },
});

export const deleteExperience = mutation({
  args: {
    experienceId: v.id("experiences"),
  },
  handler: async (ctx, { experienceId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingExperience = await ctx.db.get(experienceId);

    if (!existingExperience) {
      throw new ConvexError({ message: "Experience not found." });
    }

    if (existingExperience.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingExperience._id);
  },
});
