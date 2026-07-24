import { z } from "zod";

const platformVal = z.object({
  platform: z.string().min(2, "Platform name must be specified"),
  url: z.string().url("Invalid platform URL"),
  handle: z.string().min(1, "User handle must be specified"),
  followerCount: z.number().min(0).default(0),
});

export const socialsConfigSchema = z.object({
  body: z.object({
    platforms: z.array(platformVal).default([]),
  }),
});
