import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";
import { Resource } from "./resources.model";
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

export async function getResourcesList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const { category, type, search, sort, status } = req.query;
    const filter: FilterQuery<typeof Resource> = {};

    const isAdmin = isUserAdmin(req);
    if (!isAdmin) {
      filter.status = "published";
    } else if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = category;
    }

    if (type) {
      filter.type = type;
    }

    if (search) {
      const regex = new RegExp(String(search), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    let sortQuery: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
      const sortStr = String(sort);
      const direction = sortStr.startsWith("-") ? -1 : 1;
      const field = sortStr.startsWith("-") ? sortStr.substring(1) : sortStr;
      sortQuery = { [field]: direction };
    }

    const list = await Resource.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Resource.countDocuments(filter);

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

export async function getResourceBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug } = req.params;
    const doc = await Resource.findOne({ slug });

    if (!doc) {
      throw new AppError("Resource not found", 404);
    }

    if (doc.status === "draft") {
      const isAdmin = isUserAdmin(req);
      if (!isAdmin) {
        throw new AppError("Resource not found", 404);
      }
    }

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function createResource(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await Resource.create(req.body);
    res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function updateResource(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Resource.findById(id);
    if (!doc) {
      throw new AppError("Resource not found", 404);
    }

    Object.assign(doc, req.body);
    await doc.save();

    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function deleteResource(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Resource.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Resource not found", 404);
    }
    res.status(200).json({ status: "success", message: "Resource successfully deleted" });
  } catch (error) {
    next(error);
  }
}

export async function downloadResource(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }, { new: true });
    if (!resource) {
      throw new AppError("Resource not found", 404);
    }
    res.status(200).json({ status: "success", fileUrl: resource.fileUrl, downloadCount: resource.downloadCount });
  } catch (error) {
    next(error);
  }
}
