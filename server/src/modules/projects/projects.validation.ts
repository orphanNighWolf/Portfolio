import { z } from "zod";

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    category: z.string().min(1, "Category is required").trim(),
    tags: z.array(z.string()).default([]),
    shortDescription: z.string().min(1, "Short description is required"),
    problemStatement: z.string().min(1, "Problem statement is required"),
    solution: z.string().min(1, "Solution markdown is required"),
    challenges: z.string().min(1, "Challenges markdown is required"),
    futureImprovements: z.string().min(1, "Future improvements markdown is required"),
    techStack: z.array(z.string()).min(1, "At least one technology is required"),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    liveDemoUrl: z.string().url("Invalid Live Demo URL").optional().or(z.literal("")),
    gallery: z.array(z.string()).default([]),
    videos: z.array(z.string()).default([]),
    architectureImages: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    status: z.enum(["draft", "published"]).default("draft"),
  }),
});
