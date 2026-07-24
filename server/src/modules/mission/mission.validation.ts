import { z } from "zod";

export const missionSchema = z.object({
  body: z.object({
    careerMission: z.string().min(1, "Career mission is required"),
    longTermGoals: z.array(z.string()).default([]),
    vision: z.string().min(1, "Vision is required"),
    values: z.array(z.string()).default([]),
    currentLearning: z.array(z.string()).default([]),
    futureRoadmap: z.array(z.string()).default([]),
  }),
});
