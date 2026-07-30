/**
 * /src/aggregator
 * Deduplication algorithms across multi-source listings (same company + title + location).
 */
export interface JobAggregator<T> {
  deduplicate(items: T[]): T[];
}
