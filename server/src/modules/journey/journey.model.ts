import mongoose, { Schema, Document } from "mongoose";

export interface IJourney extends Document {
  type: "school" | "college" | "internship" | "project" | "learning" | "achievement" | "futureGoal";
  title: string;
  description: string;
  dateRange: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const JourneySchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["school", "college", "internship", "project", "learning", "achievement", "futureGoal"],
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    dateRange: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
  },
  { timestamps: true, collection: "journey" }
);

export const Journey = mongoose.models.Journey || mongoose.model<IJourney>("Journey", JourneySchema);
