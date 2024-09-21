import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
);

export const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(1, { message: "Old password is required" }),
  newPassword: z
    .string()
    .min(1, { message: "New password is required" })
    .regex(passwordRegex, {
      message:
        "New password must have at least 8 characters with 1 uppercase, 1 lowercase, 1 number and 1 special character",
    }),
});

export const notificationPreferencesFormSchema = z.object({
  receiveJobNotifications: z.boolean(),
  receivePostNotifications: z.boolean(),
  receiveCommentNotifications: z.boolean(),
  receiveMessageNotifications: z.boolean(),
});

export const presencePreferencesFormSchema = z.object({
  showOnlinePresence: z.boolean(),
  doNotDisturb: z.boolean(),
});
