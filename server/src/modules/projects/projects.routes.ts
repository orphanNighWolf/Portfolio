import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { getProjects, getProjectBySlug, createProject, updateProject, deleteProject } from "./projects.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { projectSchema } from "./projects.validation";
import { uploadImageBuffer } from "../../config/cloudinary";
import { AppError } from "../../middleware/error";

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images, PDFs, and ZIP archives are allowed"));
    }
  },
});

async function uploadMediaFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }
    const result = await uploadImageBuffer(req.file.buffer, "projects");
    res.status(200).json({
      status: "success",
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    next(error);
  }
}

router.get("/projects", getProjects);
router.get("/projects/:slug", getProjectBySlug);
router.post("/projects", requireAuth, requireAdmin, validate(projectSchema), createProject);
router.put("/projects/:id", requireAuth, requireAdmin, validate(projectSchema), updateProject);
router.delete("/projects/:id", requireAuth, requireAdmin, deleteProject);
router.post("/media/upload", requireAuth, requireAdmin, upload.single("file"), uploadMediaFile);

export default router;
