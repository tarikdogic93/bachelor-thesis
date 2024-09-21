import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getPresencePreferences = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    const presencePreferences = await ctx.db
      .query("presencePreferences")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    return presencePreferences;
  },
});

export const upsertPresencePreferences = mutation({
  args: {
    showOnlinePresence: v.boolean(),
    doNotDisturb: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingPresencePreferences = await ctx.db
      .query("presencePreferences")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    if (existingPresencePreferences) {
      await ctx.db.patch(existingPresencePreferences._id, args);
    } else {
      await ctx.db.insert("presencePreferences", {
        userId: user._id,
        ...args,
      });
    }
  },
});
