import { Router } from "express";
import { getJourneyList, createJourney, updateJourney, deleteJourney } from "./journey.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { journeySchema } from "./journey.validation";

const router = Router();

router.get("/journey", getJourneyList);
router.post("/journey", requireAuth, requireAdmin, validate(journeySchema), createJourney);
router.put("/journey/:id", requireAuth, requireAdmin, validate(journeySchema), updateJourney);
router.delete("/journey/:id", requireAuth, requireAdmin, deleteJourney);

export default router;
