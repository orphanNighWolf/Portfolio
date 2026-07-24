import { z } from "zod";

export const mentorshipServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    duration: z.string().optional().default(""),
  }),
});

export const mentorshipBookingSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    service: z.string().min(2, "Service title is required"),
    preferredDate: z.string().min(1, "Preferred date is required"),
    time: z.string().min(1, "Preferred time is required"),
    message: z.string().optional().default(""),
  }),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  text: z.string().min(5),
  avatarUrl: z.string().optional().default(""),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
});

export const mentorshipConfigSchema = z.object({
  body: z.object({
    testimonials: z.array(testimonialSchema),
    faqs: z.array(faqSchema),
  }),
});
