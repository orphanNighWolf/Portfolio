import { JobListing, ScoredJobListing, CandidateSkillProfile } from "./types";

export const DEFAULT_CANDIDATE_PROFILE: CandidateSkillProfile = {
  targetRoles: [
    "Full Stack Next.js Developer",
    "Software Engineer",
    "Data Analytics Executive",
    "Frontend Developer",
    "Backend Developer"
  ],
  primarySkills: [
    "Next.js",
    "TypeScript",
    "React 19",
    "Node.js",
    "Express",
    "NestJS",
    "Prisma ORM",
    "MongoDB",
    "Redis",
    "Tailwind CSS",
    "Python",
    "SQL",
    "Power BI (DAX / Power Query)"
  ],
  secondarySkills: [
    "TanStack React Query",
    "Zustand",
    "Argon2",
    "bcryptjs",
    "Vitest",
    "Git",
    "GitHub",
    "Excel",
    "FastAPI",
    "SlowAPI"
  ],
  preferredLocations: ["Remote", "Dehradun", "Bareilly", "Noida", "Gurugram", "Bengaluru", "India"]
};

export class JobScorer {
  public static scoreJobs(
    jobs: JobListing[],
    profile: CandidateSkillProfile = DEFAULT_CANDIDATE_PROFILE
  ): ScoredJobListing[] {
    const scored = jobs.map((job) => this.scoreSingleJob(job, profile));
    // Sort in descending order of match score
    return scored.sort((a, b) => b.matchScore - a.matchScore);
  }

  public static scoreSingleJob(
    job: JobListing,
    profile: CandidateSkillProfile
  ): ScoredJobListing {
    const searchText = `${job.title} ${job.company} ${job.location} ${job.snippet || ""}`.toLowerCase();
    
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Weight 1: Primary Skills Match (up to 60 points)
    let primaryMatchCount = 0;
    for (const skill of profile.primarySkills) {
      if (this.textContainsSkill(searchText, skill)) {
        matchedSkills.push(skill);
        primaryMatchCount++;
      } else {
        missingSkills.push(skill);
      }
    }

    const primaryScore = Math.min(60, (primaryMatchCount / Math.min(5, profile.primarySkills.length)) * 60);

    // Weight 2: Target Role Title Match (up to 25 points)
    let roleScore = 0;
    for (const role of profile.targetRoles) {
      const roleKeywords = role.toLowerCase().split(" ");
      const hasMatch = roleKeywords.some(kw => kw.length > 2 && searchText.includes(kw));
      if (hasMatch) {
        roleScore = 25;
        break;
      }
    }

    // Weight 3: Preferred Location Match (up to 15 points)
    let locationScore = 0;
    const isRemoteOrMatch = profile.preferredLocations.some((loc) =>
      searchText.includes(loc.toLowerCase())
    );
    if (isRemoteOrMatch) {
      locationScore = 15;
    }

    const totalScore = Math.round(primaryScore + roleScore + locationScore);
    const finalScore = Math.min(100, Math.max(30, totalScore));

    return {
      ...job,
      matchScore: finalScore,
      matchedSkills,
      missingSkills: missingSkills.slice(0, 4)
    };
  }

  private static textContainsSkill(text: string, skill: string): boolean {
    const cleanSkill = skill.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleanText = text.replace(/[^a-z0-9]/g, "");
    return cleanText.includes(cleanSkill);
  }
}
