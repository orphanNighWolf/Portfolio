import { Request, Response, NextFunction } from "express";
import { Achievement } from "./achievements.model";
import { AppError } from "../../middleware/error";

export async function getAchievementsList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await Achievement.find().sort({ date: -1 });
    res.status(200).json({ status: "success", data: list });
  } catch (error) {
    next(error);
  }
}

export async function createAchievement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body = { ...req.body };
    if (typeof body.date === "string") {
      body.date = new Date(body.date);
    }
    const doc = await Achievement.create(body);
    res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function updateAchievement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (typeof body.date === "string") {
      body.date = new Date(body.date);
    }
    const doc = await Achievement.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!doc) {
      throw new AppError("Achievement entry not found", 404);
    }
    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function deleteAchievement(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Achievement.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Achievement entry not found", 404);
    }
    res.status(200).json({ status: "success", message: "Achievement entry successfully deleted" });
  } catch (error) {
    next(error);
  }
}
