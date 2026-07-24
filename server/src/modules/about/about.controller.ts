import { Request, Response, NextFunction } from "express";
import { About } from "./about.model";

export async function getAbout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const about = await About.findOne();
    res.status(200).json({ status: "success", data: about || null });
  } catch (error) {
    next(error);
  }
}

export async function updateAbout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let about = await About.findOne();
    if (about) {
      Object.assign(about, req.body);
      await about.save();
    } else {
      about = await About.create(req.body);
    }
    res.status(200).json({ status: "success", data: about });
  } catch (error) {
    next(error);
  }
}
