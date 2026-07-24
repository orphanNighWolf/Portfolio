import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";
import { Blog } from "./blogs.model";
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

export async function getBlogsList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 6);
    const skip = (page - 1) * limit;

    const { category, tag, search, sort, status } = req.query;
    const filter: FilterQuery<typeof Blog> = {};

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
      filter.$or = [{ title: regex }, { markdownContent: regex }];
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

    const list = await Blog.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      status: "success",
      data: list,
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

export async function getBlogBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const doc = await Blog.findOne({ slug });

    if (!doc) {
      throw new AppError("Blog not found", 404);
    }

    if (doc.status === "draft") {
      const isAdmin = isUserAdmin(req);
      if (!isAdmin) {
        throw new AppError("Blog not found", 404);
      }
    }

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function createBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await Blog.create(req.body);
    res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Blog.findById(id);
    if (!doc) {
      throw new AppError("Blog not found", 404);
    }

    Object.assign(doc, req.body);
    await doc.save();

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Blog.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Blog not found", 404);
    }
    res.status(200).json({ status: "success", message: "Blog successfully deleted" });
  } catch (error) {
    next(error);
  }
}
