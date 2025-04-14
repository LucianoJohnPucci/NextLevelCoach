
import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  event_date: z.date({ required_error: "Event date is required" }),
  notes: z.string().optional(),
  is_free: z.boolean().default(true),
  ticket_cost: z.number().optional(),
  max_participants: z.number().min(1, { message: "Minimum of 1 participant required" }),
});

export type EventFormValues = z.infer<typeof eventSchema>;
