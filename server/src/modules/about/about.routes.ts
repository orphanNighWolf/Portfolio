import { Router } from "express";
import { getAbout, updateAbout } from "./about.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { aboutSchema } from "./about.validation";

const router = Router();

router.get("/about", getAbout);
router.put("/about", requireAuth, requireAdmin, validate(aboutSchema), updateAbout);

export default router;
