import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png"];

export const threadFormSchema = z.object({
  title: z
    .string()
    .refine((title) => (title ? !!title.trim() : false), {
      message: "Title is required",
    })
    .transform((title) => title.trim()),
  image: z
    .instanceof(File, {
      message: "Must be a file",
    })
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File size cannot be more than 1MB")
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be an image"),
  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional()
    .transform((description) =>
      description && description.trim() ? description.trim() : undefined,
    ),
});

export const managePostFormSchema = z.object({
  title: z
    .string()
    .refine((title) => (title ? !!title.trim() : false), {
      message: "Title is required",
    })
    .transform((title) => title.trim()),
});

export const manageCommentFormSchema = z.object({
  text: z
    .string()
    .max(500, { message: "Text cannot exceed 500 characters" })
    .refine((text) => (text ? !!text.trim() : false), {
      message: "Text is required",
    })
    .transform((text) => text.trim()),
});
