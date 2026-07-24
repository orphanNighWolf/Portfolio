import { Request, Response, NextFunction } from "express";
import { Journey } from "./journey.model";
import { AppError } from "../../middleware/error";

export async function getJourneyList(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const list = await Journey.find().sort({ createdAt: 1 });
    res.status(200).json({ status: "success", data: list });
  } catch (error) {
    next(error);
  }
}

export async function createJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const doc = await Journey.create(req.body);
    res.status(201).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function updateJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Journey.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!doc) {
      throw new AppError("Journey entry not found", 404);
    }
    res.status(200).json({ status: "success", data: doc });
  } catch (error) {
    next(error);
  }
}

export async function deleteJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Journey.findByIdAndDelete(id);
    if (!doc) {
      throw new AppError("Journey entry not found", 404);
    }
    res.status(200).json({ status: "success", message: "Journey entry successfully deleted" });
  } catch (error) {
    next(error);
  }
}
