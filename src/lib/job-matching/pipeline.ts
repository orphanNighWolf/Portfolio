import { JobListing, ScoredJobListing, JobProvider, CandidateSkillProfile } from "./types";
import { LinkedInEmailProvider, GmailAuthConfig } from "./gmail-fetcher";
import { IndeedApiProvider, ZipRecruiterApiProvider, DiceApiProvider } from "./providers/api-providers";
import { JobDeduplicator } from "./deduplicator";
import { JobScorer, DEFAULT_CANDIDATE_PROFILE } from "./scorer";

export interface PipelineConfig {
  gmailConfig?: GmailAuthConfig;
  indeedApiKey?: string;
  zipRecruiterApiKey?: string;
  diceApiKey?: string;
  candidateProfile?: CandidateSkillProfile;
}

export class JobMatchingPipeline {
  private providers: JobProvider[] = [];
  private profile: CandidateSkillProfile;

  constructor(config: PipelineConfig = {}) {
    this.profile = config.candidateProfile || DEFAULT_CANDIDATE_PROFILE;

    // Register Multi-Source Job Providers
    this.providers = [
      new LinkedInEmailProvider(config.gmailConfig),
      new IndeedApiProvider(config.indeedApiKey),
      new ZipRecruiterApiProvider(config.zipRecruiterApiKey),
      new DiceApiProvider(config.diceApiKey)
    ];
  }

  /**
   * Executes full multi-source extraction, deduplication, and ranking pipeline
   */
  public async executePipeline(): Promise<ScoredJobListing[]> {
    console.log("[Job Pipeline]: Executing multi-source fetch across providers...");

    // Fetch from all providers concurrently using Promise.allSettled
    const results = await Promise.allSettled(
      this.providers.map(p => p.fetchJobs())
    );

    let rawJobs: JobListing[] = [];
    results.forEach((res, idx) => {
      if (res.status === "fulfilled") {
        rawJobs = rawJobs.concat(res.value);
        console.log(`[Job Pipeline]: ${this.providers[idx].name} returned ${res.value.length} job(s).`);
      } else {
        console.warn(`[Job Pipeline]: Provider ${this.providers[idx].name} failed:`, res.reason);
      }
    });

    // Step 2: Deduplicate listings across all sources
    const deduplicatedJobs = JobDeduplicator.deduplicate(rawJobs);
    console.log(`[Job Pipeline]: Deduplication reduced ${rawJobs.length} raw jobs to ${deduplicatedJobs.length} unique jobs.`);

    // Step 3: Score & rank against Candidate Skill Profile
    const rankedJobs = JobScorer.scoreJobs(deduplicatedJobs, this.profile);
    return rankedJobs;
  }

  /**
   * Exports pipeline results to formatted CSV string
   */
  public static exportToCsv(jobs: ScoredJobListing[]): string {
    const headers = ["Title", "Company", "Location", "Match Score (%)", "Source", "Apply URL", "Matched Skills"];
    const rows = jobs.map((job) => [
      `"${job.title.replace(/"/g, '""')}"`,
      `"${job.company.replace(/"/g, '""')}"`,
      `"${job.location.replace(/"/g, '""')}"`,
      job.matchScore,
      job.source,
      `"${job.applyUrl}"`,
      `"${job.matchedSkills.join(", ")}"`
    ]);

    return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  }
}
