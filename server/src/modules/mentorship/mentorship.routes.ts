import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getMentorshipDetails,
  bookSession,
  getBookings,
  updateBookingStatus,
  updateMentorshipConfig,
  createService,
  updateService,
  deleteService,
} from "./mentorship.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import {
  mentorshipBookingSchema,
  mentorshipServiceSchema,
  mentorshipConfigSchema,
} from "./mentorship.validation";

// Specific rate limit for bookings to prevent request spamming
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit 5 bookings per IP
  message: { error: "Too many booking attempts, please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

// Public routes
router.get("/mentorship", getMentorshipDetails);
router.post("/mentorship/book", bookingLimiter, validate(mentorshipBookingSchema), bookSession);

// Admin-only bookings management
router.get("/mentorship/bookings", requireAuth, requireAdmin, getBookings);
router.put("/mentorship/bookings/:id", requireAuth, requireAdmin, updateBookingStatus);

// Admin-only config management (FAQ & Testimonials)
router.put("/mentorship/config", requireAuth, requireAdmin, validate(mentorshipConfigSchema), updateMentorshipConfig);

// Admin-only services management
router.post("/mentorship/services", requireAuth, requireAdmin, validate(mentorshipServiceSchema), createService);
router.put("/mentorship/services/:id", requireAuth, requireAdmin, validate(mentorshipServiceSchema), updateService);
router.delete("/mentorship/services/:id", requireAuth, requireAdmin, deleteService);

export default router;
