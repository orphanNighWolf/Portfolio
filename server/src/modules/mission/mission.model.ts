import mongoose, { Schema, Document } from "mongoose";

export interface IMission extends Document {
  careerMission: string;
  longTermGoals: string[];
  vision: string;
  values: string[];
  currentLearning: string[];
  futureRoadmap: string[];
}

const MissionSchema = new Schema(
  {
    careerMission: { type: String, required: true },
    longTermGoals: [{ type: String }],
    vision: { type: String, required: true },
    values: [{ type: String }],
    currentLearning: [{ type: String }],
    futureRoadmap: [{ type: String }],
  },
  { timestamps: true, collection: "mission" }
);

export const Mission = mongoose.models.Mission || mongoose.model<IMission>("Mission", MissionSchema);
