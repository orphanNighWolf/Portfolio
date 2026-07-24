import { Schema, model } from "mongoose";

const platformSchema = new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  handle: { type: String, required: true },
  followerCount: { type: Number, default: 0 },
});

const socialsSchema = new Schema(
  {
    platforms: [platformSchema],
  },
  { timestamps: true, collection: "socials_config" }
);

export const SocialsConfig = model("SocialsConfig", socialsSchema);
