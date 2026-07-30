export * from './gmail.js';
export * from './token-cache.js';

export interface JobSourceFetcher {
  sourceName: string;
  fetchRawData(): Promise<unknown[]>;
}
