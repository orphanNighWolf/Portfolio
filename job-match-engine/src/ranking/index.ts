/**
 * /src/ranking
 * Scoring & ranking engine based on candidate skill keyword match.
 */
export interface JobRanker<TInput, TScored> {
  rank(items: TInput[]): TScored[];
}
