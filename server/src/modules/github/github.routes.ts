import { Router } from "express";
import { getOverview, refreshCache } from "./github.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.get("/github/overview", getOverview);
router.post("/github/refresh", requireAuth, requireAdmin, refreshCache);

export default router;
