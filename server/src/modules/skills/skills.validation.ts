import { z } from "zod";

export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").trim(),
    category: z.enum(
      ["Programming", "Frontend", "Backend", "Database", "DevOps", "AI", "Cloud", "Tools"],
      { required_error: "Invalid or missing skill category" }
    ),
    level: z.number().min(0).max(100, "Level must be between 0 and 100"),
    yearsExperience: z.number().min(0, "Years of experience must be 0 or more"),
    icon: z.string().optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});
