import { Router } from "express";
import { getResume, updateResume, downloadResumePDF } from "./resume.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { resumeDataSchema } from "./resume.validation";

const router = Router();

// Public routes
router.get("/resume", getResume);
router.get("/resume/pdf", downloadResumePDF);

// Admin route
router.put("/resume", requireAuth, requireAdmin, validate(resumeDataSchema), updateResume);

export default router;
