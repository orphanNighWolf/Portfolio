import { Router } from "express";
import { getMission, updateMission } from "./mission.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { missionSchema } from "./mission.validation";

const router = Router();

router.get("/mission", getMission);
router.put("/mission", requireAuth, requireAdmin, validate(missionSchema), updateMission);

export default router;
