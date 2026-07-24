import { Router } from "express";
import { getSkills, createSkill, updateSkill, deleteSkill } from "./skills.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { skillSchema } from "./skills.validation";

const router = Router();

router.get("/skills", getSkills);
router.post("/skills", requireAuth, requireAdmin, validate(skillSchema), createSkill);
router.put("/skills/:id", requireAuth, requireAdmin, validate(skillSchema), updateSkill);
router.delete("/skills/:id", requireAuth, requireAdmin, deleteSkill);

export default router;
