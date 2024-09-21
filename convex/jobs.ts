import { ConvexError, v } from "convex/values";
import { paginationOptsValidator, PaginationResult } from "convex/server";

import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkUserRole, getCurrentUser, getCurrentUserOrThrow } from "./users";

export const getJobs = query({
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
      } as PaginationResult<Doc<"jobs">>;
    }

    let jobs: PaginationResult<Doc<"jobs">>;

    if (searchText) {
      if (user.role !== "Company") {
        jobs = await ctx.db
          .query("jobs")
          .withSearchIndex("searchTitle", (q) => q.search("title", searchText))
          .paginate(paginationOpts);
      } else {
        jobs = await ctx.db
          .query("jobs")
          .withSearchIndex("searchTitle", (q) =>
            q.search("title", searchText).eq("userId", user._id),
          )
          .paginate(paginationOpts);
      }
    } else {
      if (user.role !== "Company") {
        jobs = await ctx.db
          .query("jobs")
          .order("desc")
          .paginate(paginationOpts);
      } else {
        jobs = await ctx.db
          .query("jobs")
          .withIndex("byUserId", (q) => q.eq("userId", user._id))
          .order("desc")
          .paginate(paginationOpts);
      }
    }

    return jobs;
  },
});

export const createJob = mutation({
  args: {
    title: v.string(),
    jobSector: v.union(
      v.literal("Web development"),
      v.literal("Mobile development"),
      v.literal("Artificial intelligence"),
      v.literal("Cloud computing"),
      v.literal("DevOps engineering"),
      v.literal("Other"),
    ),
    jobType: v.union(
      v.literal("Full-time"),
      v.literal("Part-time"),
      v.literal("Contract"),
      v.literal("Internship"),
    ),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    salaryRangeMin: v.number(),
    salaryRangeMax: v.number(),
    benefits: v.array(v.string()),
    educationLevel: v.union(
      v.literal("High school diploma"),
      v.literal("Associate degree"),
      v.literal("Bachelor's degree"),
      v.literal("Master's degree"),
      v.literal("PhD"),
    ),
    experienceLevel: v.union(
      v.literal("Entry level"),
      v.literal("Mid-level"),
      v.literal("Senior level"),
    ),
    techStack: v.array(v.string()),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    startDate: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Company");

    const applicationDeadline = new Date();
    applicationDeadline.setDate(applicationDeadline.getDate() + 7);

    await ctx.db.insert("jobs", {
      ...args,
      userId: user._id,
      applicationDeadline: applicationDeadline.toISOString(),
    });
  },
});

export const updateJob = mutation({
  args: {
    jobId: v.id("jobs"),
    title: v.string(),
    jobSector: v.union(
      v.literal("Web development"),
      v.literal("Mobile development"),
      v.literal("Artificial intelligence"),
      v.literal("Cloud computing"),
      v.literal("DevOps engineering"),
      v.literal("Other"),
    ),
    jobType: v.union(
      v.literal("Full-time"),
      v.literal("Part-time"),
      v.literal("Contract"),
      v.literal("Internship"),
    ),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    settingType: v.union(
      v.literal("Onsite"),
      v.literal("Hybrid"),
      v.literal("Remote"),
    ),
    salaryRangeMin: v.number(),
    salaryRangeMax: v.number(),
    benefits: v.array(v.string()),
    educationLevel: v.union(
      v.literal("High school diploma"),
      v.literal("Associate degree"),
      v.literal("Bachelor's degree"),
      v.literal("Master's degree"),
      v.literal("PhD"),
    ),
    experienceLevel: v.union(
      v.literal("Entry level"),
      v.literal("Mid-level"),
      v.literal("Senior level"),
    ),
    techStack: v.array(v.string()),
    requirements: v.array(v.string()),
    responsibilities: v.array(v.string()),
    startDate: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { jobId, country, city, settingType, description, ...restArgs },
  ) => {
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

    await ctx.db.patch(existingJob._id, {
      ...restArgs,
      country: settingType === "Remote" ? undefined : country,
      city: settingType === "Remote" ? undefined : city,
      settingType,
      description: description || undefined,
      updateTime: new Date().toISOString(),
    });
  },
});

export const applyToJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, { jobId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    await checkUserRole(user, "Applicant");

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      throw new ConvexError({ message: "Job listing not found." });
    }

    const existingApplicant = await ctx.db
      .query("jobApplicants")
      .withIndex("byUserId_byJobId", (q) =>
        q.eq("userId", user._id).eq("jobId", jobId),
      )
      .unique();

    if (existingApplicant) {
      throw new ConvexError({
        message: "You have already applied to this job.",
      });
    }

    const applicationDeadline = new Date(
      Date.parse(existingJob.applicationDeadline),
    );
    const now = new Date();

    if (now >= applicationDeadline) {
      throw new ConvexError({
        message: "The application deadline for this job has passed.",
      });
    }

    await ctx.db.insert("jobApplicants", {
      userId: user._id,
      jobId,
      status: "processing",
      appliedTime: new Date().toISOString(),
      searchable: `${user.firstName} ${user.lastName} ${user.emailAddress}`,
    });
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("jobs"),
  },
  handler: async (ctx, { jobId }) => {
    const user = await getCurrentUserOrThrow(ctx);

    const existingJob = await ctx.db.get(jobId);

    if (!existingJob) {
      throw new ConvexError({ message: "Job listing not found." });
    }

    if (user.role !== "Admin" && existingJob.userId !== user._id) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.delete(existingJob._id);

    const applicants = await ctx.db
      .query("jobApplicants")
      .withIndex("byJobId", (q) => q.eq("jobId", jobId))
      .collect();

    await Promise.all(
      applicants.map(async (applicant) => await ctx.db.delete(applicant._id)),
    );
  },
});
