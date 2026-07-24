import { z } from "zod";

export const blogSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    category: z.string().min(1, "Category is required").trim(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().min(0, "Reading time must be 0 or more"),
    markdownContent: z.string().min(1, "Content is required"),
    featured: z.boolean().default(false),
    relatedBlogSlugs: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
  }),
});
