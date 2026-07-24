import { Request, Response, NextFunction } from "express";
import { getGitHubData } from "./github.service";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "alex-mercer";

export async function getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getGitHubData(GITHUB_USERNAME, false);
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(error);
  }
}

export async function refreshCache(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await getGitHubData(GITHUB_USERNAME, true);
    res.status(200).json({ status: "success", message: "Cache successfully refreshed", data });
  } catch (error) {
    next(error);
  }
}
