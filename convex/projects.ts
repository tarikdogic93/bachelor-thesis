import { ConvexError, v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getProjects = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    const user = await getCurrentUser(ctx);

    let projects: Doc<"projects">[] = [];

    if (user) {
      if (userId) {
        projects = await ctx.db
          .query("projects")
          .withIndex("byUserId", (q) => q.eq("userId", userId))
          .collect();
      } else {
        projects = await ctx.db
          .query("projects")
          .withIndex("byUserId", (q) => q.eq("userId", user._id))
          .collect();
      }
    }

    const projectsWithImages = await Promise.all(
      projects.map(async (project) => ({
        ...project,
        ...(project.image && {
          image: {
            name: project.image.name,
            type: project.image.type,
            url: (await ctx.storage.getUrl(
              project.image.url,
            )) as Id<"_storage">,
          },
        }),
      })),
    );

    return projectsWithImages;
  },
});

export const createProject = mutation({
  args: {
    title: v.string(),
    category: v.union(
      v.literal("Web development"),
      v.literal("Mobile app development"),
      v.literal("Desktop app development"),
      v.literal("Game development"),
      v.literal("Database management system"),
      v.literal("Content management system"),
      v.literal("E-commerce platform development"),
      v.literal("Artificial intelligence"),
      v.literal("DevOps tools"),
      v.literal("Cloud computing"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    numberOfPeople: v.optional(v.number()),
    priceRangeMin: v.optional(v.number()),
    priceRangeMax: v.optional(v.number()),
    image: v.optional(
      v.object({ name: v.string(), type: v.string(), url: v.id("_storage") }),
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Company");

    await ctx.db.insert("projects", { ...args, userId: user._id });
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    category: v.union(
      v.literal("Web development"),
      v.literal("Mobile app development"),
      v.literal("Desktop app development"),
      v.literal("Game development"),
      v.literal("Database management system"),
      v.literal("Content management system"),
      v.literal("E-commerce platform development"),
      v.literal("Artificial intelligence"),
      v.literal("DevOps tools"),
      v.literal("Cloud computing"),
    ),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    isOngoing: v.boolean(),
    numberOfPeople: v.optional(v.number()),
    priceRangeMin: v.optional(v.number()),
    priceRangeMax: v.optional(v.number()),
    image: v.optional(
      v.object({ name: v.string(), type: v.string(), url: v.id("_storage") }),
    ),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      projectId,
      endDate,
      isOngoing,
      numberOfPeople,
      priceRangeMin,
      priceRangeMax,
      image,
      description,
      ...restArgs
    },
  ) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingProject = await ctx.db.get(projectId);

    if (!existingProject) {
      throw new ConvexError({ message: "Project not found." });
    }

    if (existingProject.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    if (image && existingProject.image) {
      await ctx.storage.delete(existingProject.image.url);
    }

    await ctx.db.patch(existingProject._id, {
      ...restArgs,
      endDate: isOngoing ? undefined : endDate,
      isOngoing,
      numberOfPeople: numberOfPeople || undefined,
      priceRangeMin: priceRangeMin || undefined,
      priceRangeMax: priceRangeMax || undefined,
      image: image ? image : existingProject.image,
      description: description || undefined,
    });
  },
});

export const removeProjectImage = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingProject = await ctx.db.get(projectId);

    if (!existingProject) {
      throw new ConvexError({ message: "Project not found." });
    }

    if (existingProject.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    if (existingProject.image) {
      const existingImageInStorage = await ctx.storage.getUrl(
        existingProject.image.url,
      );

      if (!existingImageInStorage) {
        throw new ConvexError({ message: "Image not found in storage." });
      }

      await ctx.storage.delete(existingProject.image.url);

      await ctx.db.patch(existingProject._id, {
        image: undefined,
      });
    }
  },
});

export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingProject = await ctx.db.get(projectId);

    if (!existingProject) {
      throw new ConvexError({ message: "Project not found." });
    }

    if (existingProject.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingProject._id);

    if (existingProject.image) {
      await ctx.storage.delete(existingProject.image.url);
    }
  },
});
