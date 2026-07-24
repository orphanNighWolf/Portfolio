import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { globalSettingsSchema } from "./settings.validation";

const router = Router();

// Public route
router.get("/settings", getSettings);

// Admin route
router.put("/settings", requireAuth, requireAdmin, validate(globalSettingsSchema), updateSettings);

export default router;
