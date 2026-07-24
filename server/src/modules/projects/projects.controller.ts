import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";
import { Project } from "./projects.model";
import { AppError } from "../../middleware/error";
import jwt from "jsonwebtoken";

function isUserAdmin(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  try {
    const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { role: string };
    return decoded && decoded.role === "admin";
  } catch {
    return false;
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 6);
    const skip = (page - 1) * limit;

    const { category, tag, search, sort, status } = req.query;
    const filter: FilterQuery<typeof Project> = {};

    const isAdmin = isUserAdmin(req);
    if (!isAdmin) {
      filter.status = "published";
    } else if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      const regex = new RegExp(String(search), "i");
      filter.$or = [{ title: regex }, { shortDescription: regex }];
    }

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "featured") {
      sortQuery = { featured: -1, createdAt: -1 };
    } else if (sort) {
      const sortStr = String(sort);
      const direction = sortStr.startsWith("-") ? -1 : 1;
      const field = sortStr.startsWith("-") ? sortStr.substring(1) : sortStr;
      sortQuery = { [field]: direction };
    }

    const projects = await Project.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProjectBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug });

    if (!project) {
      throw new AppError("Project not found", 404);
    }

    if (project.status === "draft") {
      const isAdmin = isUserAdmin(req);
      if (!isAdmin) {
        throw new AppError("Project not found", 404);
      }
    }

    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }

    Object.assign(project, req.body);
    await project.save();

    res.status(200).json({ status: "success", data: project });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    res.status(200).json({ status: "success", message: "Project successfully deleted" });
  } catch (error) {
    next(error);
  }
}
