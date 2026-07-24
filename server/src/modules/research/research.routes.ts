import { Router } from "express";
import { getResearchList, getResearchBySlug, createResearch, updateResearch, deleteResearch } from "./research.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { researchSchema } from "./research.validation";

const router = Router();

router.get("/research", getResearchList);
router.get("/research/:slug", getResearchBySlug);
router.post("/research", requireAuth, requireAdmin, validate(researchSchema), createResearch);
router.put("/research/:id", requireAuth, requireAdmin, validate(researchSchema), updateResearch);
router.delete("/research/:id", requireAuth, requireAdmin, deleteResearch);

export default router;
