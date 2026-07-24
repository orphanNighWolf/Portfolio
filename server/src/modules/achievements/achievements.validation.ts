import { z } from "zod";

export const achievementSchema = z.object({
  body: z.object({
    type: z.enum(["certificate", "hackathon", "competition", "award", "badge", "conference"]),
    title: z.string().min(1, "Title is required").trim(),
    organization: z.string().min(1, "Organization is required").trim(),
    date: z.string().min(1, "Date is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Invalid Image URL").optional().or(z.literal("")),
    link: z.string().url("Invalid link URL").optional().or(z.literal("")),
  }),
});
