import mongoose, { Schema, Document } from "mongoose";

export interface IAchievement extends Document {
  type: "certificate" | "hackathon" | "competition" | "award" | "badge" | "conference";
  title: string;
  organization: string;
  date: Date;
  description: string;
  imageUrl?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["certificate", "hackathon", "competition", "award", "badge", "conference"],
    },
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    link: { type: String },
  },
  { timestamps: true, collection: "achievements" }
);

export const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>("Achievement", AchievementSchema);
