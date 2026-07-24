import { Router } from "express";
import rateLimit from "express-rate-limit";
import { chat, rebuildIndex, getStatus } from "./assistant.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Aggressive rate limit for chat (LLM calls cost money)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute window
  max: 10,                // 10 requests per minute per IP
  message: {
    status: "error",
    message: "Too many requests. Please wait a moment before sending another message.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.get("/assistant/status", getStatus);
router.post("/assistant/chat", chatLimiter, chat);

// Admin routes
router.post("/assistant/rebuild-index", requireAuth, requireAdmin, rebuildIndex);

export default router;
