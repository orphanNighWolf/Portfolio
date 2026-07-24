import { Router } from "express";
import { getAchievementsList, createAchievement, updateAchievement, deleteAchievement } from "./achievements.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { achievementSchema } from "./achievements.validation";

const router = Router();

router.get("/achievements", getAchievementsList);
router.post("/achievements", requireAuth, requireAdmin, validate(achievementSchema), createAchievement);
router.put("/achievements/:id", requireAuth, requireAdmin, validate(achievementSchema), updateAchievement);
router.delete("/achievements/:id", requireAuth, requireAdmin, deleteAchievement);

export default router;
