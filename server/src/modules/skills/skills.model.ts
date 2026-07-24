import mongoose, { Schema, Document } from "mongoose";

export type SkillCategory =
  | "Programming"
  | "Frontend"
  | "Backend"
  | "Database"
  | "DevOps"
  | "AI"
  | "Cloud"
  | "Tools";

export interface ISkill extends Document {
  name: string;
  category: SkillCategory;
  level: number; // 0 to 100
  yearsExperience: number;
  linkedProjectIds: mongoose.Types.ObjectId[];
  icon?: string;
  description?: string;
  featured: boolean;
}

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Programming", "Frontend", "Backend", "Database", "DevOps", "AI", "Cloud", "Tools"],
    },
    level: { type: Number, required: true, min: 0, max: 100 },
    yearsExperience: { type: Number, required: true, min: 0 },
    linkedProjectIds: [{ type: Schema.Types.ObjectId, ref: "Project", default: [] }],
    icon: { type: String },
    description: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "skills" }
);

SkillSchema.index(
  {
    name: "text",
    category: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      category: 5,
      description: 2,
    },
    name: "SkillTextIndex",
  }
);

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema);
