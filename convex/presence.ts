import { v } from "convex/values";

import { Doc } from "./_generated/dataModel";
import { query, mutation } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getPresenceInRoom = query({
  args: { room: v.string() },
  handler: async (ctx, { room }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return [];
    }

    const presence = await ctx.db
      .query("presence")
      .withIndex("byRoom", (q) => q.eq("room", room))
      .filter((q) => q.neq(q.field("userId"), user._id))
      .collect();

    const userIds = presence.map((obj) => obj.userId);

    const presencePreferences = await Promise.all(
      userIds.map(async (userId) => {
        const presencePreference = await ctx.db
          .query("presencePreferences")
          .withIndex("byUserId", (q) => q.eq("userId", userId))
          .unique();

        if (presencePreference) {
          const { userId, showOnlinePresence, doNotDisturb } =
            presencePreference;

          return { userId, showOnlinePresence, doNotDisturb };
        } else {
          return {
            userId,
            showOnlinePresence: true,
            doNotDisturb: false,
          };
        }
      }),
    );

    const presenceInRoom = presence.map((obj, index) => {
      const lastPresentTime = new Date(Date.parse(obj.lastPresentTime));

      const isUserOnline =
        new Date().getTime() - lastPresentTime.getTime() <= 10000;

      return {
        userId: obj.userId,
        isUserOnline,
        showOnlinePresence: presencePreferences[index].showOnlinePresence,
        doNotDisturb: presencePreferences[index].doNotDisturb,
      };
    });

    return presenceInRoom;
  },
});

export const upsertPresence = mutation({
  args: {
    room: v.string(),
  },
  handler: async (ctx, { room }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const presencePreference = await ctx.db
      .query("presencePreferences")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .unique();

    if (
      !presencePreference ||
      (presencePreference.showOnlinePresence &&
        !presencePreference.doNotDisturb)
    ) {
      const existingPresence = await ctx.db
        .query("presence")
        .withIndex("byRoom_byUserId", (q) =>
          q.eq("room", room).eq("userId", user._id),
        )
        .unique();

      if (existingPresence) {
        await ctx.db.patch(existingPresence._id, {
          lastPresentTime: new Date().toISOString(),
        });
      } else {
        await ctx.db.insert("presence", {
          userId: user._id,
          room,
          lastPresentTime: new Date().toISOString(),
        });
      }
    }
  },
});
