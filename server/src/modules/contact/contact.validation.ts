import { z } from "zod";

export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    subject: z.string().min(3, "Subject must be at least 3 characters long"),
    message: z.string().min(10, "Message must be at least 10 characters long"),
    honeypot: z.string().optional().default(""),
  }),
});
