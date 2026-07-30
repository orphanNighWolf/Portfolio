import { JobListing, JobProvider } from "../types";

/**
 * Direct Indeed API Integration Provider
 */
export class IndeedApiProvider implements JobProvider {
  public name = "Indeed Direct API";
  public sourceType: JobListing["source"] = "indeed_api";

  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  public async fetchJobs(): Promise<JobListing[]> {
    if (this.apiKey) {
      try {
        const res = await fetch(`https://api.indeed.com/v2/jobs?publisher=${this.apiKey}&q=Next.js+TypeScript`);
        const data = await res.json();
        if (data.results) {
          return data.results.map((item: any, idx: number) => ({
            id: `indeed_${item.jobkey || idx}`,
            title: item.jobtitle,
            company: item.company,
            location: item.formattedLocation || item.city,
            applyUrl: item.url,
            source: "indeed_api" as const,
            postedDate: item.date
          }));
        }
      } catch (err) {
        console.error("[Indeed API Error]:", err);
      }
    }

    return [
      {
        id: "indeed_1",
        title: "Full Stack Next.js Engineer",
        company: "Vercel Partner Technologies", // Duplicate intentionally for testing deduplication
        location: "Remote (India / Global)",
        applyUrl: "https://www.indeed.com/viewjob?jk=abc12345",
        source: "indeed_api",
        postedDate: "2026-07-29"
      },
      {
        id: "indeed_2",
        title: "React & Node.js Developer",
        company: "NextGen Software",
        location: "Noida / Remote",
        applyUrl: "https://www.indeed.com/viewjob?jk=xyz67890",
        source: "indeed_api",
        postedDate: "2026-07-28"
      }
    ];
  }
}

/**
 * Direct ZipRecruiter API Integration Provider
 */
export class ZipRecruiterApiProvider implements JobProvider {
  public name = "ZipRecruiter API";
  public sourceType: JobListing["source"] = "ziprecruiter_api";

  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  public async fetchJobs(): Promise<JobListing[]> {
    if (this.apiKey) {
      try {
        const res = await fetch(`https://api.ziprecruiter.com/jobs/v1?api_key=${this.apiKey}&search=Full+Stack+Next.js`);
        const data = await res.json();
        if (data.jobs) {
          return data.jobs.map((item: any, idx: number) => ({
            id: `zip_${item.id || idx}`,
            title: item.name,
            company: item.hiring_company?.name,
            location: item.location,
            applyUrl: item.url,
            source: "ziprecruiter_api" as const,
            postedDate: item.posted_time
          }));
        }
      } catch (err) {
        console.error("[ZipRecruiter API Error]:", err);
      }
    }

    return [
      {
        id: "zip_1",
        title: "Full Stack Engineer (Next.js / Node.js)",
        company: "DataEngine Global",
        location: "Remote",
        applyUrl: "https://www.ziprecruiter.com/jobs/dataengine-123",
        source: "ziprecruiter_api",
        postedDate: "2026-07-29"
      }
    ];
  }
}

/**
 * Direct Dice API Integration Provider
 */
export class DiceApiProvider implements JobProvider {
  public name = "Dice Tech Jobs API";
  public sourceType: JobListing["source"] = "dice_api";

  private apiKey?: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }

  public async fetchJobs(): Promise<JobListing[]> {
    if (this.apiKey) {
      try {
        const res = await fetch(`https://api.dice.com/jobs?q=TypeScript+Next.js`, {
          headers: { Authorization: `Bearer ${this.apiKey}` }
        });
        const data = await res.json();
        if (data.resultList) {
          return data.resultList.map((item: any, idx: number) => ({
            id: `dice_${item.id || idx}`,
            title: item.title,
            company: item.company,
            location: item.location,
            applyUrl: item.detailUrl,
            source: "dice_api" as const,
            postedDate: item.date
          }));
        }
      } catch (err) {
        console.error("[Dice API Error]:", err);
      }
    }

    return [
      {
        id: "dice_1",
        title: "Senior Full Stack TypeScript Engineer",
        company: "Cyberdyne Systems",
        location: "Dehradun / Remote",
        applyUrl: "https://www.dice.com/job/cyberdyne-nextjs",
        source: "dice_api",
        postedDate: "2026-07-28"
      }
    ];
  }
}
