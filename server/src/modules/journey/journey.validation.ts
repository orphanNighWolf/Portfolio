import { z } from "zod";

export const journeySchema = z.object({
  body: z.object({
    type: z.enum(["school", "college", "internship", "project", "learning", "achievement", "futureGoal"]),
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required"),
    dateRange: z.string().min(1, "Date range is required").trim(),
    icon: z.string().min(1, "Icon name is required").trim(),
  }),
});
