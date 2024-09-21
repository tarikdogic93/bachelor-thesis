import { ConvexError, v } from "convex/values";
import { paginationOptsValidator, PaginationResult } from "convex/server";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getJobApplicants = query({
  args: {
    jobId: v.optional(v.id("jobs")),
    searchText: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { jobId, searchText, paginationOpts }) => {
    const user = await getCurrentUser(ctx);

    if (!user || !jobId) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"users"> | null>;
    }

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"users"> | null>;
    }

    let applicants: PaginationResult<Doc<"jobApplicants">>;

    if (searchText) {
      applicants = await ctx.db
        .query("jobApplicants")
        .withSearchIndex("searchFullNameOrEmailAddress", (q) =>
          q.search("searchable", searchText).eq("jobId", jobId),
        )
        .paginate(paginationOpts);
    } else {
      applicants = await ctx.db
        .query("jobApplicants")
        .withIndex("byJobId", (q) => q.eq("jobId", jobId))
        .paginate(paginationOpts);
    }

    const users = await Promise.all(
      applicants.page.map(
        async (applicant) => await ctx.db.get(applicant.userId),
      ),
    );

    return {
      page: users,
      isDone: applicants.isDone,
      continueCursor: applicants.continueCursor,
    } as PaginationResult<Doc<"users"> | null>;
  },
});

export const getJobApplicantsInfo = query({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, { jobId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return 0;
    }

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      return 0;
    }

    const applicants = await ctx.db
      .query("jobApplicants")
      .withIndex("byJobId", (q) => q.eq("jobId", jobId))
      .collect();

    return applicants.length;
  },
});

export const getExistingJobApplicant = query({
  args: {
    jobId: v.id("jobs"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { jobId, userId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      return null;
    }

    let existingApplicant: Doc<"jobApplicants"> | null = null;

    if (userId) {
      existingApplicant = await ctx.db
        .query("jobApplicants")
        .withIndex("byUserId_byJobId", (q) =>
          q.eq("userId", userId).eq("jobId", jobId),
        )
        .unique();
    } else {
      existingApplicant = await ctx.db
        .query("jobApplicants")
        .withIndex("byUserId_byJobId", (q) =>
          q.eq("userId", user._id).eq("jobId", jobId),
        )
        .unique();
    }

    return existingApplicant;
  },
});

export const updateJobApplicantStatus = mutation({
  args: {
    jobId: v.id("jobs"),
    userId: v.id("users"),
    status: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, { jobId, userId, status }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      throw new ConvexError({ message: "Job listing not found." });
    }

    if (existingJob.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const existingApplicant = await ctx.db
      .query("jobApplicants")
      .withIndex("byUserId_byJobId", (q) =>
        q.eq("userId", userId).eq("jobId", jobId),
      )
      .unique();

    if (!existingApplicant) {
      throw new ConvexError({
        message: "This user has not applied to this job.",
      });
    }

    if (status !== existingApplicant.status) {
      await ctx.db.patch(existingApplicant._id, {
        status,
        rejectionReason:
          status === "accepted" ? undefined : existingApplicant.rejectionReason,
      });

      const notificationPreferences = await ctx.db
        .query("notificationPreferences")
        .withIndex("byUserId", (q) => q.eq("userId", userId))
        .unique();

      if (
        !notificationPreferences ||
        notificationPreferences.receiveJobNotifications
      ) {
        const existingNotification = await ctx.db
          .query("notifications")
          .withIndex("byUserId_byReferenceId", (q) =>
            q.eq("userId", userId).eq("referenceId", existingJob._id),
          )
          .unique();

        if (existingNotification) {
          await ctx.db.patch(existingNotification._id, {
            message: `Your application for the job '${existingJob.title}' has been ${status}.`,
          });
        } else {
          await ctx.db.insert("notifications", {
            userId,
            referenceId: existingJob._id,
            message: `Your application for the job '${existingJob.title}' has been ${status}.`,
          });
        }
      }
    }
  },
});

export const updateJobApplicantRejectionReason = mutation({
  args: {
    jobId: v.id("jobs"),
    userId: v.id("users"),
    rejectionReason: v.string(),
  },
  handler: async (ctx, { jobId, userId, rejectionReason }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      throw new ConvexError({ message: "Job listing not found." });
    }

    if (existingJob.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    const existingApplicant = await ctx.db
      .query("jobApplicants")
      .withIndex("byUserId_byJobId", (q) =>
        q.eq("userId", userId).eq("jobId", jobId),
      )
      .unique();

    if (!existingApplicant) {
      throw new ConvexError({
        message: "This user has not applied to this job.",
      });
    }

    await ctx.db.patch(existingApplicant._id, { rejectionReason });
  },
});
