import { z } from "zod";

const personalInfoVal = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  github: z.string().optional().default(""),
  location: z.string().optional().default(""),
  title: z.string().min(2),
  summary: z.string().min(10),
});

const experienceVal = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  startDate: z.string().min(4),
  endDate: z.string().min(4),
  description: z.string().min(10),
});

const educationVal = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  startDate: z.string().min(4),
  endDate: z.string().min(4),
});

const projectVal = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  role: z.string().min(2),
  techStack: z.array(z.string()).default([]),
  link: z.string().optional().default(""),
});

const skillVal = z.object({
  name: z.string().min(1),
  level: z.number().min(0).max(100),
  category: z.string().min(2),
});

const certificateVal = z.object({
  name: z.string().min(2),
  issuer: z.string().min(2),
  date: z.string().min(4),
  credentialUrl: z.string().optional().default(""),
});

export const resumeDataSchema = z.object({
  body: z.object({
    personalInfo: personalInfoVal,
    experience: z.array(experienceVal).default([]),
    education: z.array(educationVal).default([]),
    projects: z.array(projectVal).default([]),
    skills: z.array(skillVal).default([]),
    certificates: z.array(certificateVal).default([]),
  }),
});
