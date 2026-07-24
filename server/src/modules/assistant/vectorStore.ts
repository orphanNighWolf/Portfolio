/**
 * In-memory vector store with cosine similarity search.
 * For portfolio-scale content (~50-200 chunks), this is perfectly adequate.
 */

import { KnowledgeChunk } from "./chunker";

let store: KnowledgeChunk[] = [];

/**
 * Replace the entire store with a new set of chunks.
 */
export function setStore(chunks: KnowledgeChunk[]): void {
  store = chunks;
}

/**
 * Get the current store contents.
 */
export function getStore(): KnowledgeChunk[] {
  return store;
}

/**
 * Get the number of chunks in the store.
 */
export function getStoreSize(): number {
  return store.length;
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Search for the top-K most relevant chunks given a query embedding.
 */
export function searchSimilar(queryEmbedding: number[], topK = 5): Array<KnowledgeChunk & { score: number }> {
  if (store.length === 0 || queryEmbedding.length === 0) return [];

  const scored = store
    .filter((chunk) => chunk.embedding && chunk.embedding.length > 0)
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * Simple TF-IDF based fallback search (no embeddings needed).
 * Used when no embedding API key is configured.
 */
export function searchByKeyword(query: string, topK = 5): Array<KnowledgeChunk & { score: number }> {
  if (store.length === 0 || !query.trim()) return [];

  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  const scored = store.map((chunk) => {
    const content = chunk.content.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
      // Count occurrences of each query term
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const matches = content.match(regex);
      if (matches) {
        // TF component (normalized by content length)
        score += matches.length / (content.length / 100);
      }
    }

    // Boost exact phrase matches
    if (content.includes(query.toLowerCase())) {
      score *= 2;
    }

    // Boost title matches
    if (chunk.sourceTitle.toLowerCase().includes(query.toLowerCase())) {
      score *= 3;
    }

    return { ...chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
