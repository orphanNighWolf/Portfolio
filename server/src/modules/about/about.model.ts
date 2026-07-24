import mongoose, { Schema, Document } from "mongoose";

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface IExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface ITimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface IAbout extends Document {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  location: string;
  education: IEducation[];
  experience: IExperience[];
  interests: string[];
  techStack: string[];
  currentFocus: string;
  timeline: ITimelineItem[];
  mentorshipCta: string;
  contactCta: string;
}

const EducationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
});

const ExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String },
  current: { type: Boolean, default: false },
  description: { type: String, required: true },
});

const TimelineItemSchema = new Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const AboutSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String },
    location: { type: String, required: true },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    interests: [{ type: String }],
    techStack: [{ type: String }],
    currentFocus: { type: String, required: true },
    timeline: [TimelineItemSchema],
    mentorshipCta: { type: String, required: true },
    contactCta: { type: String, required: true },
  },
  { timestamps: true, collection: "about" }
);

export const About = mongoose.models.About || mongoose.model<IAbout>("About", AboutSchema);
