import { Router } from "express";
import { getResourcesList, getResourceBySlug, createResource, updateResource, deleteResource, downloadResource } from "./resources.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { resourceSchema } from "./resources.validation";

const router = Router();

router.get("/resources", getResourcesList);
router.get("/resources/:slug", getResourceBySlug);
router.post("/resources", requireAuth, requireAdmin, validate(resourceSchema), createResource);
router.put("/resources/:id", requireAuth, requireAdmin, validate(resourceSchema), updateResource);
router.delete("/resources/:id", requireAuth, requireAdmin, deleteResource);
router.post("/resources/:id/download", downloadResource);

export default router;
