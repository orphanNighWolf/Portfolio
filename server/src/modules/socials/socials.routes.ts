import { Router } from "express";
import { getSocials, updateSocials } from "./socials.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { socialsConfigSchema } from "./socials.validation";

const router = Router();

// Public routes
router.get("/socials", getSocials);

// Admin route
router.put("/socials", requireAuth, requireAdmin, validate(socialsConfigSchema), updateSocials);

export default router;
