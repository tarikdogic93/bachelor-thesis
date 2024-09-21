import { z } from "zod";

export const sendMessageFormSchema = z.object({
  text: z
    .string()
    .refine((text) => (text ? !!text.trim() : false), {
      message: "Text is required",
    })
    .transform((text) => text.trim()),
});
