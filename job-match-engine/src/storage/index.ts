/**
 * /src/storage
 * Export engine for generating structured JSON / CSV outputs.
 */
export interface JobStorage<T> {
  save(data: T[], destinationPath: string): Promise<void>;
}
