import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getNotificationPreferences = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    const notificationPreferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    return notificationPreferences;
  },
});

export const upsertNotificationPreferences = mutation({
  args: {
    receiveJobNotifications: v.boolean(),
    receivePostNotifications: v.boolean(),
    receiveCommentNotifications: v.boolean(),
    receiveMessageNotifications: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingNotificationPreferences = await ctx.db
      .query("notificationPreferences")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    if (existingNotificationPreferences) {
      await ctx.db.patch(existingNotificationPreferences._id, args);
    } else {
      await ctx.db.insert("notificationPreferences", {
        userId: user._id,
        ...args,
      });
    }
  },
});
