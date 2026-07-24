import { Request, Response, NextFunction } from "express";
import { Mission } from "./mission.model";

export async function getMission(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mission = await Mission.findOne();
    res.status(200).json({ status: "success", data: mission || null });
  } catch (error) {
    next(error);
  }
}

export async function updateMission(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let mission = await Mission.findOne();
    if (mission) {
      Object.assign(mission, req.body);
      await mission.save();
    } else {
      mission = await Mission.create(req.body);
    }
    res.status(200).json({ status: "success", data: mission });
  } catch (error) {
    next(error);
  }
}
