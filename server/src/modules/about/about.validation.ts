import { z } from "zod";

export const aboutSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    bio: z.string().min(1, "Bio is required"),
    avatarUrl: z.string().url("Invalid URL format").optional().or(z.literal("")),
    location: z.string().min(1, "Location is required"),
    education: z.array(
      z.object({
        institution: z.string().min(1, "Institution is required"),
        degree: z.string().min(1, "Degree is required"),
        fieldOfStudy: z.string().min(1, "Field of study is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().default(false),
      })
    ).default([]),
    experience: z.array(
      z.object({
        company: z.string().min(1, "Company is required"),
        position: z.string().min(1, "Position is required"),
        location: z.string().min(1, "Location is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().optional(),
        current: z.boolean().default(false),
        description: z.string().min(1, "Description is required"),
      })
    ).default([]),
    interests: z.array(z.string()).default([]),
    techStack: z.array(z.string()).default([]),
    currentFocus: z.string().min(1, "Current focus is required"),
    timeline: z.array(
      z.object({
        year: z.string().min(1, "Year is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
      })
    ).default([]),
    mentorshipCta: z.string().min(1, "Mentorship CTA text is required"),
    contactCta: z.string().min(1, "Contact CTA text is required"),
  }),
});
