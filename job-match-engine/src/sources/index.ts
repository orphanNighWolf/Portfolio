/**
 * /src/sources
 * Per-platform fetchers (Gmail API / LinkedIn Digest, Indeed, ZipRecruiter, Dice).
 */
export interface JobSourceFetcher {
  sourceName: string;
  fetchRawData(): Promise<unknown[]>;
}
