import { ConvexError, v, Validator } from "convex/values";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { UserJSON } from "@clerk/backend";

import { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

export const getUsersByRole = query({
  args: {
    role: v.union(
      v.literal("Admin"),
      v.literal("Applicant"),
      v.literal("Company"),
    ),
    searchText: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { role, searchText, paginationOpts }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      } as PaginationResult<Doc<"users">>;
    }

    let users: PaginationResult<Doc<"users">>;

    if (searchText) {
      users = await ctx.db
        .query("users")
        .withSearchIndex("searchFullNameOrEmailAddress", (q) =>
          q.search("searchable", searchText).eq("role", role),
        )
        .filter((q) => q.neq(q.field("_id"), user._id))
        .paginate(paginationOpts);
    } else {
      users = await ctx.db
        .query("users")
        .withIndex("byRole", (q) => q.eq("role", role))
        .order("desc")
        .filter((q) => q.neq(q.field("_id"), user._id))
        .paginate(paginationOpts);
    }

    return users;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);

    return currentUser;
  },
});

export const getUserById = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, { userId }) => {
    const user = await getCurrentUser(ctx);

    if (!user) {
      return null;
    }

    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  handler: async (ctx, { data }) => {
    const userAttributes = {
      externalId: data.id,
      role: data.public_metadata["role"] as Doc<"users">["role"],
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      emailAddress: data.email_addresses[0].email_address,
      imageUrl: data.image_url,
    };

    const user = await getUserByExternalId(ctx, data.id);

    if (user === null) {
      await ctx.db.insert("users", {
        ...userAttributes,
        searchable: `${userAttributes.firstName} ${userAttributes.lastName} ${userAttributes.emailAddress}`,
      });
    } else {
      await ctx.db.patch(user._id, {
        ...userAttributes,
        searchable: `${userAttributes.firstName} ${userAttributes.lastName} ${userAttributes.emailAddress}`,
      });

      const applicants = await ctx.db
        .query("jobApplicants")
        .withIndex("byUserId", (q) => q.eq("userId", user._id))
        .collect();

      await Promise.all(
        applicants.map(
          async (applicant) =>
            await ctx.db.patch(applicant._id, {
              searchable: `${userAttributes.firstName} ${userAttributes.lastName} ${userAttributes.emailAddress}`,
            }),
        ),
      );
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await getUserByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}.`,
      );
    }
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    companyName: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
    age: v.optional(v.number()),
    country: v.optional(v.object({ name: v.string(), alpha3Code: v.string() })),
    city: v.optional(v.string()),
    streetAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    establishmentYear: v.optional(v.number()),
    numberOfEmployees: v.optional(v.number()),
    languages: v.optional(v.array(v.string())),
    socialMediaLinks: v.optional(v.array(v.string())),
  },
  handler: async (
    ctx,
    {
      userId,
      companyName,
      gender,
      age,
      country,
      city,
      streetAddress,
      phoneNumber,
      establishmentYear,
      numberOfEmployees,
      languages,
      socialMediaLinks,
    },
  ) => {
    const user = await getCurrentUserOrThrow(ctx);

    if (user._id !== userId) {
      throw new ConvexError({
        message: "You are not authorized to perform this action.",
      });
    }

    await ctx.db.patch(user._id, {
      companyName: user.role === "Company" ? companyName : undefined,
      gender: user.role === "Applicant" ? gender : undefined,
      age: user.role === "Applicant" ? age : undefined,
      country: user.role !== "Admin" ? country : undefined,
      city: user.role !== "Admin" ? city : undefined,
      streetAddress: user.role !== "Admin" ? streetAddress : undefined,
      phoneNumber: user.role !== "Admin" ? phoneNumber : undefined,
      establishmentYear:
        user.role === "Company" ? establishmentYear : undefined,
      numberOfEmployees:
        user.role === "Company" ? numberOfEmployees : undefined,
      languages: user.role === "Applicant" ? languages : undefined,
      socialMediaLinks: user.role !== "Admin" ? socialMediaLinks : undefined,
    });
  },
});

export async function checkUserRole(
  user: Doc<"users">,
  role: Exclude<Doc<"users">["role"], undefined>,
) {
  if (user.role !== role) {
    throw new ConvexError({
      message: "You are not authorized to perform this action.",
    });
  }
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);

  if (!userRecord) {
    throw new ConvexError({ message: "Can't get current user." });
  }

  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity === null) {
    return null;
  }

  const user = await getUserByExternalId(ctx, identity.subject);

  return user;
}

async function getUserByExternalId(ctx: QueryCtx, externalId: string) {
  const user = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();

  return user;
}
