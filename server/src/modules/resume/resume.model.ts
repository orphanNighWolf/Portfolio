import { Schema, model } from "mongoose";

const personalInfoSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: "" },
  website: { type: String, default: "" },
  github: { type: String, default: "" },
  location: { type: String, default: "" },
  title: { type: String, required: true },
  summary: { type: String, required: true },
});

const experienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true }, // e.g. "Present" or "2026-06"
  description: { type: String, required: true },
});

const educationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, required: true },
  techStack: [{ type: String }],
  link: { type: String, default: "" },
});

const skillSchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100 },
  category: { type: String, required: true }, // e.g. "Backend"
});

const certificateSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  credentialUrl: { type: String, default: "" },
});

const resumeSchema = new Schema(
  {
    personalInfo: { type: personalInfoSchema, required: true },
    experience: [experienceSchema],
    education: [educationSchema],
    projects: [projectSchema],
    skills: [skillSchema],
    certificates: [certificateSchema],
  },
  { timestamps: true, collection: "resume_data" }
);

export const ResumeData = model("ResumeData", resumeSchema);
