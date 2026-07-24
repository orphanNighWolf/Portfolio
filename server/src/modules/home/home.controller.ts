import { Request, Response, NextFunction } from "express";
import { About } from "../about/about.model";
import { Skill } from "../skills/skills.model";
import { Project } from "../projects/projects.model";
import { Research } from "../research/research.model";
import { getGitHubData } from "../github/github.service";

export async function getHomeData(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const about = await About.findOne();
    
    // Fetch up to 6 featured skills sorted by level descending
    const featuredSkills = await Skill.find({ featured: true })
      .sort({ level: -1 })
      .limit(6);

    // Fetch latest published projects
    const latestProjects = await Project.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch featured published projects
    const featuredProjects = await Project.find({ featured: true, status: "published" })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch latest published research highlights
    const researchHighlights = await Research.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(3);

    // Fetch recent github activity from cache
    const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "alex-mercer";
    const githubData = await getGitHubData(GITHUB_USERNAME, false);

    res.status(200).json({
      status: "success",
      data: {
        hero: {
          name: about?.name || "",
          title: about?.title || "",
          bio: about?.bio || "",
          location: about?.location || "",
          avatarUrl: about?.avatarUrl || "",
        },
        featuredSkills,
        projects: latestProjects,
        featuredProjects,
        latestBlog: [],
        research: researchHighlights,
        githubActivity: githubData?.recentActivity || [],
        mentorshipCta: about?.mentorshipCta || "Interested in learning? Book a mentorship session with me.",
        contactCta: about?.contactCta || "Feel free to reach out for collaborations or opportunities.",
      },
    });
  } catch (error) {
    next(error);
  }
}
