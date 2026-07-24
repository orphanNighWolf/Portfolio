import { Router } from "express";
import { getBlogsList, getBlogBySlug, createBlog, updateBlog, deleteBlog } from "./blogs.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { blogSchema } from "./blogs.validation";

const router = Router();

router.get("/blogs", getBlogsList);
router.get("/blogs/:slug", getBlogBySlug);
router.post("/blogs", requireAuth, requireAdmin, validate(blogSchema), createBlog);
router.put("/blogs/:id", requireAuth, requireAdmin, validate(blogSchema), updateBlog);
router.delete("/blogs/:id", requireAuth, requireAdmin, deleteBlog);

export default router;
