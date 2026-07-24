import { z } from "zod";

export const resourceSchema = z.object({
  body: z.object({
    type: z.enum(["note", "pdf", "template", "cheatsheet", "roadmap"]),
    title: z.string().min(1, "Title is required").trim(),
    category: z.string().min(1, "Category is required").trim(),
    description: z.string().min(1, "Description is required"),
    fileUrl: z.string().url("Invalid File URL").min(1, "File URL is required"),
    downloadCount: z.number().min(0).default(0),
    status: z.enum(["draft", "published"]).default("draft"),
  }),
});
