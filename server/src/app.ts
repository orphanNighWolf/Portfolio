import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import pino from "pino";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error";
import healthRouter from "./modules/health/health.routes";
import authRouter from "./modules/auth/auth.routes";
import aboutRouter from "./modules/about/about.routes";
import missionRouter from "./modules/mission/mission.routes";
import skillsRouter from "./modules/skills/skills.routes";
import homeRouter from "./modules/home/home.routes";
import projectsRouter from "./modules/projects/projects.routes";
import researchRouter from "./modules/research/research.routes";
import blogsRouter from "./modules/blogs/blogs.routes";
import journeyRouter from "./modules/journey/journey.routes";
import achievementsRouter from "./modules/achievements/achievements.routes";
import resourcesRouter from "./modules/resources/resources.routes";
import githubRouter from "./modules/github/github.routes";
import mentorshipRouter from "./modules/mentorship/mentorship.routes";
import contactRouter from "./modules/contact/contact.routes";
import resumeRouter from "./modules/resume/resume.routes";
import socialsRouter from "./modules/socials/socials.routes";
import searchRouter from "./modules/search/search.routes";
import analyticsRouter from "./modules/analytics/analytics.routes";
import settingsRouter from "./modules/settings/settings.routes";
import assistantRouter from "./modules/assistant/assistant.routes";
import { trackVisit } from "./middleware/analytics";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const app = express();

// Standard middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(trackVisit); // Graceful visitor tracking middleware

// Log incoming requests
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API rate-limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 10000 : 100, // Relax rate limits during development
  message: { error: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// Routes
app.use("/api", healthRouter);
app.use("/api", authRouter);
app.use("/api", aboutRouter);
app.use("/api", missionRouter);
app.use("/api", skillsRouter);
app.use("/api", homeRouter);
app.use("/api/projects", trackVisit); // Make sure tracking triggers on projects index
app.use("/api", projectsRouter);
app.use("/api", researchRouter);
app.use("/api", blogsRouter);
app.use("/api", journeyRouter);
app.use("/api", achievementsRouter);
app.use("/api", resourcesRouter);
app.use("/api", githubRouter);
app.use("/api", mentorshipRouter);
app.use("/api", contactRouter);
app.use("/api", resumeRouter);
app.use("/api", socialsRouter);
app.use("/api", searchRouter);
app.use("/api", analyticsRouter);
app.use("/api", settingsRouter);
app.use("/api", assistantRouter);

// Root greeting route
app.get("/", (_req, res) => {
  res.json({
    status: "active",
    message: "Personal Intelligence Platform API Server",
    healthCheck: "/api/health"
  });
});

// Standardized centralized error handler
app.use(errorHandler);

export default app;
