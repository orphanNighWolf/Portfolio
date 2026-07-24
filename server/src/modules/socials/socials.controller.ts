import { Request, Response, NextFunction } from "express";
import { SocialsConfig } from "./socials.model";
import { GitHubCache } from "../github/github.model";

export async function getSocials(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let socials = await SocialsConfig.findOne();
    if (!socials) {
      socials = await SocialsConfig.create({
        platforms: [
          { platform: "GitHub", url: "https://github.com/alex-mercer", handle: "alex-mercer", followerCount: 0 },
          { platform: "Twitter", url: "https://twitter.com/alex-mercer", handle: "@alex_mercer", followerCount: 1200 },
          { platform: "LinkedIn", url: "https://linkedin.com/in/alex-mercer", handle: "alex-mercer", followerCount: 3400 },
        ],
      });
    }

    // Attempt to lookup GitHub Live/Cached followers count
    let githubFollowers = 0;
    try {
      const gitCache = await GitHubCache.findOne({ username: "alex-mercer" });
      if (gitCache?.profile?.followers) {
        githubFollowers = gitCache.profile.followers;
      }
    } catch (err) {
      console.error("Failed to read GitHub cache in socials aggregator:", err);
    }

    const modifiedPlatforms = socials.platforms.map((p: any) => {
      const pObj = p.toObject ? p.toObject() : p;
      if (pObj.platform.toLowerCase() === "github") {
        return {
          ...pObj,
          followerCount: githubFollowers || pObj.followerCount,
        };
      }
      return pObj;
    });

    res.status(200).json({
      status: "success",
      data: {
        _id: socials._id,
        platforms: modifiedPlatforms,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSocials(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let socials = await SocialsConfig.findOne();
    if (!socials) {
      socials = new SocialsConfig(req.body);
    } else {
      socials.platforms = req.body.platforms;
    }
    await socials.save();
    res.status(200).json({ status: "success", data: socials });
  } catch (error) {
    next(error);
  }
}
