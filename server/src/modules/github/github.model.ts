import { Schema, model } from "mongoose";

const repoSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  htmlUrl: { type: String, required: true },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: { type: String, default: "" },
  updatedAt: { type: String, required: true },
});

const activitySchema = new Schema({
  type: { type: String, required: true },
  repoName: { type: String, required: true },
  message: { type: String, default: "" },
  createdAt: { type: String, required: true },
});

const githubCacheSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    profile: {
      name: { type: String, default: "" },
      avatarUrl: { type: String, default: "" },
      followers: { type: Number, default: 0 },
      publicRepos: { type: Number, default: 0 },
      htmlUrl: { type: String, required: true },
    },
    repos: [repoSchema],
    languages: { type: Map, of: Number, default: {} },
    recentActivity: [activitySchema],
  },
  { timestamps: true }
);

export const GitHubCache = model("GitHubCache", githubCacheSchema);
