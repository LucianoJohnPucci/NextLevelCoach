
import { z } from "zod";

export const reflectionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  author: z.string().min(2, { message: "Author name is required" }),
  description: z.string().optional(),
  minutes: z.number().min(1, { message: "Reading time must be at least 1 minute" }),
});

export type ReflectionFormValues = z.infer<typeof reflectionSchema>;
