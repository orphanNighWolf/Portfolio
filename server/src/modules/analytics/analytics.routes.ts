import { Router } from "express";
import { getAdminSummary, getAnalyticsOverview } from "./analytics.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.get("/admin/summary", requireAuth, requireAdmin, getAdminSummary);
router.get("/analytics/overview", requireAuth, requireAdmin, getAnalyticsOverview);

export default router;
