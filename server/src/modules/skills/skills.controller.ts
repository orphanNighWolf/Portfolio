import { Request, Response, NextFunction } from "express";
import { FilterQuery } from "mongoose";
import { Skill } from "./skills.model";
import { AppError } from "../../middleware/error";

export async function getSkills(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, search } = req.query;
    const filter: FilterQuery<typeof Skill> = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), "i");
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    const skills = await Skill.find(filter).sort({ name: 1 });
    res.status(200).json({ status: "success", data: skills });
  } catch (error) {
    next(error);
  }
}

export async function createSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const existing = await Skill.findOne({ name: req.body.name });
    if (existing) {
      throw new AppError("Skill with this name already exists", 400);
    }
    const skill = await Skill.create(req.body);
    res.status(201).json({ status: "success", data: skill });
  } catch (error) {
    next(error);
  }
}

export async function updateSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!skill) {
      throw new AppError("Skill not found", 404);
    }
    res.status(200).json({ status: "success", data: skill });
  } catch (error) {
    next(error);
  }
}

export async function deleteSkill(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      throw new AppError("Skill not found", 404);
    }
    res.status(200).json({ status: "success", message: "Skill successfully deleted" });
  } catch (error) {
    next(error);
  }
}
