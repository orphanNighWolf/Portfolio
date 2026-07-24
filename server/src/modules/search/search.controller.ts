import { Request, Response, NextFunction } from "express";
import { Project } from "../projects/projects.model";
import { Blog } from "../blogs/blogs.model";
import { Research } from "../research/research.model";
import { Resource } from "../resources/resources.model";
import { Skill } from "../skills/skills.model";

export async function globalSearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (!q) {
      res.status(200).json({
        status: "success",
        data: {
          projects: [],
          blogs: [],
          research: [],
          resources: [],
          skills: [],
        },
      });
      return;
    }

    const queryObj = { $text: { $search: q } };
    const scoreObj = { score: { $meta: "textScore" } };

    const [projects, blogs, research, resources, skills] = await Promise.all([
      Project.find(queryObj, scoreObj).sort(scoreObj).limit(10),
      Blog.find(queryObj, scoreObj).sort(scoreObj).limit(10),
      Research.find(queryObj, scoreObj).sort(scoreObj).limit(10),
      Resource.find(queryObj, scoreObj).sort(scoreObj).limit(10),
      Skill.find(queryObj, scoreObj).sort(scoreObj).limit(10),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        projects,
        blogs,
        research,
        resources,
        skills,
      },
    });
  } catch (error) {
    next(error);
  }
}
