import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createMessage,
  getMessagesList,
  updateMessageStatus,
  deleteMessage,
} from "./contact.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { contactMessageSchema } from "./contact.validation";

// Specific rate limit for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit 5 messages per IP
  message: { error: "Too many messages sent, please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Public route
router.post("/contact", contactLimiter, validate(contactMessageSchema), createMessage);

// Admin-only inbox management
router.get("/contact/messages", requireAuth, requireAdmin, getMessagesList);
router.put("/contact/messages/:id", requireAuth, requireAdmin, updateMessageStatus);
router.delete("/contact/messages/:id", requireAuth, requireAdmin, deleteMessage);

export default router;
