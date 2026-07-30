export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  postedDate?: string;
  source: 'linkedin_email' | 'indeed_api' | 'ziprecruiter_api' | 'dice_api';
  snippet?: string;
  rawHtml?: string;
}

export interface ScoredJobListing extends JobListing {
  matchScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CandidateSkillProfile {
  targetRoles: string[];
  primarySkills: string[];
  secondarySkills: string[];
  preferredLocations: string[];
}

export interface JobProvider {
  name: string;
  sourceType: JobListing['source'];
  fetchJobs(): Promise<JobListing[]>;
}

export interface DeduplicationOptions {
  normalizeCompany?: boolean;
  normalizeTitle?: boolean;
}
