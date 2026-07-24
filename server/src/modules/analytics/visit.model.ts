import { Schema, model } from "mongoose";

const visitSchema = new Schema(
  {
    path: { type: String, required: true, trim: true },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    sessionHash: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "visits" }
);

// Index to optimize analytics aggregation queries
visitSchema.index({ timestamp: -1 });
visitSchema.index({ path: 1 });

export const Visit = model("Visit", visitSchema);
