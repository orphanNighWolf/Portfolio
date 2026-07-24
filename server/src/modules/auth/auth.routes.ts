import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, refresh, logout } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { loginSchema } from "./auth.validation";

const router = Router();

// Brute-force protection specifically for the login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per 15 minutes
  message: { error: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/auth/login", loginLimiter, validate(loginSchema), login);
router.post("/auth/refresh", refresh);
router.post("/auth/logout", logout);

export default router;
