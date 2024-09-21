import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await getCurrentUserOrThrow(ctx);

    const uploadUrl = await ctx.storage.generateUploadUrl();

    return uploadUrl;
  },
});

export const getMetadata = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    const metadata = await ctx.db.system.get(storageId);

    return metadata;
  },
});
