import { Schema, model } from "mongoose";

const accessibilitySchema = new Schema({
  screenReaderFriendly: { type: Boolean, default: false },
  highContrast: { type: Boolean, default: false },
});

const themeTokensSchema = new Schema({
  primaryColor: { type: String, default: "#00e5ff" }, // Cyan fallback
  secondaryColor: { type: String, default: "#ff007f" }, // Pink fallback
});

const settingsSchema = new Schema(
  {
    darkModeDefault: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    soundToggle: { type: Boolean, default: true },
    animationToggle: { type: Boolean, default: true },
    accessibilityOptions: { type: accessibilitySchema, default: () => ({}) },
    themeTokens: { type: themeTokensSchema, default: () => ({}) },
    enabledSections: {
      type: Map,
      of: Boolean,
      default: () => ({
        about: true,
        skills: true,
        projects: true,
        blogs: true,
        contact: true,
        journey: true,
        achievements: true,
        resources: true,
        mentorship: true,
        resume: true,
        assistant: true,
        research: true,
      }),
    },
  },
  { timestamps: true, collection: "global_settings" }
);

export const GlobalSettings = model("GlobalSettings", settingsSchema);
