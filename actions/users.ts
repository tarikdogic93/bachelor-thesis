"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { handleError } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

export async function deleteClerkUser(userId: string) {
  try {
    const user = await currentUser();

    if (
      !user ||
      (user.id !== userId && user?.publicMetadata.role !== "Admin")
    ) {
      throw new Error("You are not authorized to perform this action.");
    }

    try {
      await clerkClient().users.deleteUser(userId);

      return { data: null };
    } catch (err: any) {
      throw new Error(err.errors[0].longMessage);
    }
  } catch (error) {
    return {
      error: handleError(error, "DELETE_CLERK_USER", true),
    };
  }
}

export async function updateClerkUser(userId: string, values: FormData) {
  try {
    const user = await currentUser();

    if (!user || user.id !== userId) {
      throw new Error("You are not authorized to perform this action.");
    }

    const { firstName, lastName, image } = Object.fromEntries(
      values.entries(),
    ) as {
      firstName?: string;
      lastName?: string;
      image?: File;
    };

    if (firstName || lastName) {
      try {
        await clerkClient().users.updateUser(userId, {
          firstName,
          lastName,
        });
      } catch (err: any) {
        throw new Error(err.errors[0].longMessage);
      }
    }

    if (image) {
      try {
        await clerkClient().users.updateUserProfileImage(userId, {
          file: image,
        });
      } catch (err: any) {
        throw new Error(err.errors[0].longMessage);
      }
    }

    return { data: null };
  } catch (error) {
    return {
      error: handleError(error, "UPDATE_CLERK_USER", true),
    };
  }
}

export async function changeClerkUserPassword(
  userId: string,
  values: {
    oldPassword: string;
    newPassword: string;
  },
) {
  try {
    const user = await currentUser();

    if (!user || user.id !== userId) {
      throw new Error("You are not authorized to perform this action.");
    }

    const { oldPassword, newPassword } = values;

    try {
      await clerkClient().users.verifyPassword({
        userId,
        password: oldPassword,
      });

      await clerkClient().users.updateUser(userId, {
        password: newPassword,
      });

      return { data: null };
    } catch (err: any) {
      throw new Error(err.errors[0].longMessage);
    }
  } catch (error) {
    return {
      error: handleError(error, "CHANGE_CLERK_USER_PASSWORD", true),
    };
  }
}

export async function setClerkUserRole(
  userId: string,
  role?: Doc<"users">["role"],
) {
  try {
    if (role === "Admin") {
      throw new Error("You cannot set an admin role to this user.");
    }

    try {
      await clerkClient().users.updateUser(userId, {
        publicMetadata: { role },
      });

      return { data: null };
    } catch (err: any) {
      throw new Error(err.errors[0].longMessage);
    }
  } catch (error) {
    return {
      error: handleError(error, "SET_CLERK_USER_ROLE", true),
    };
  }
}
