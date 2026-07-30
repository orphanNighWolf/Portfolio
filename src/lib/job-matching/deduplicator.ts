import { JobListing, DeduplicationOptions } from "./types";

/**
 * Deduplication Engine across multi-source feeds (LinkedIn, Indeed, ZipRecruiter, Dice).
 * Merges duplicates based on normalized (company + title + location).
 */
export class JobDeduplicator {
  public static deduplicate(
    jobs: JobListing[],
    options: DeduplicationOptions = { normalizeCompany: true, normalizeTitle: true }
  ): JobListing[] {
    const seen = new Map<string, JobListing>();

    for (const job of jobs) {
      const key = this.createDeduplicationKey(job, options);

      if (!seen.has(key)) {
        seen.set(key, job);
      } else {
        // If duplicate exists, prefer entry with snippet or direct API link over generic links
        const existing = seen.get(key)!;
        if (!existing.snippet && job.snippet) {
          seen.set(key, { ...job, id: existing.id });
        }
      }
    }

    return Array.from(seen.values());
  }

  private static createDeduplicationKey(job: JobListing, options: DeduplicationOptions): string {
    const normCompany = options.normalizeCompany
      ? this.cleanString(job.company)
      : job.company.toLowerCase().trim();

    const normTitle = options.normalizeTitle
      ? this.cleanTitle(job.title)
      : job.title.toLowerCase().trim();

    const normLocation = this.cleanString(job.location);

    return `${normCompany}::${normTitle}::${normLocation}`;
  }

  private static cleanString(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .replace(/inc|llc|ltd|pvt|corp|corporation|technologies|solutions/g, "")
      .trim();
  }

  private static cleanTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .replace(/senior|sr|junior|jr|lead|principal/g, "")
      .trim();
  }
}
