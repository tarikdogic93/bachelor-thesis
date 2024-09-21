import { z } from "zod";
import { Doc } from "@/convex/_generated/dataModel";

const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const signinFormSchema = z.object({
  emailAddress: z
    .string()
    .refine((emailAddress) => (emailAddress ? !!emailAddress.trim() : false), {
      message: "Email address is required",
    })
    .refine((emailAddress) => emailRegex.test(emailAddress), {
      message: "Invalid email address",
    })
    .transform((emailAddress) => emailAddress.trim()),
  password: z.string().min(1, { message: "Password is required" }),
});

export const signupFormSchema = z.object({
  role: z
    .string()
    .refine((role) => (role ? !!role.trim() : false), {
      message: "Role is required",
    })
    .transform((role) => role.trim())
    .refine(
      (role) =>
        Object.values(["Applicant", "Company"] as Exclude<
          Doc<"users">["role"],
          "Admin" | undefined
        >[]).includes(
          role as Exclude<Doc<"users">["role"], "Admin" | undefined>,
        ),
      {
        message: "Invalid role",
      },
    ),
  firstName: z
    .string()
    .refine((firstName) => (firstName ? !!firstName.trim() : false), {
      message: "First name is required",
    })
    .transform((firstName) => firstName.trim()),
  lastName: z
    .string()
    .refine((lastName) => (lastName ? !!lastName.trim() : false), {
      message: "Last name is required",
    })
    .transform((lastName) => lastName.trim()),
  emailAddress: z
    .string()
    .refine((emailAddress) => (emailAddress ? !!emailAddress.trim() : false), {
      message: "Email address is required",
    })
    .refine((emailAddress) => emailRegex.test(emailAddress), {
      message: "Invalid email address",
    })
    .transform((emailAddress) => emailAddress.trim()),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .regex(passwordRegex, {
      message:
        "Password must have at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character",
    }),
});

export const forgotPasswordFormSchema = z.object({
  emailAddress: z
    .string()
    .refine((emailAddress) => (emailAddress ? !!emailAddress.trim() : false), {
      message: "Email address is required",
    })
    .refine((emailAddress) => emailRegex.test(emailAddress), {
      message: "Invalid email address",
    })
    .transform((emailAddress) => emailAddress.trim()),
});

export const verifyFormSchema = z.object({
  code: z
    .string()
    .refine((code) => (code ? !!code.trim() : false), {
      message: "Verification code is required",
    })
    .transform((code) => code.trim()),
});

export const resetPasswordFormSchema = z.object({
  code: z
    .string()
    .refine((code) => (code ? !!code.trim() : false), {
      message: "Verification code is required",
    })
    .transform((code) => code.trim()),
  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .regex(passwordRegex, {
      message:
        "New password must have at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character",
    }),
});
