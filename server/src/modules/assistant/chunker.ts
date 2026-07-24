/**
 * Text chunker for RAG indexing.
 * Splits markdown/text into overlapping chunks of ~500 tokens.
 */

export interface KnowledgeChunk {
  id: string;
  source: string;       // e.g. "project", "blog", "research", "resume"
  sourceId: string;      // MongoDB _id or slug
  sourceTitle: string;
  content: string;
  embedding: number[];   // populated after embedding generation
}

const CHUNK_SIZE = 500;   // approximate tokens (chars / 4)
const CHUNK_OVERLAP = 100;

/**
 * Split raw text into overlapping chunks.
 */
export function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
  if (!text || text.trim().length === 0) return [];

  // Normalize whitespace
  const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  // Target character count (rough token approximation: 1 token ≈ 4 chars)
  const charLimit = chunkSize * 4;
  const overlapChars = overlap * 4;

  // Try to split on paragraph boundaries first
  const paragraphs = cleaned.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length + 2 <= charLimit) {
      currentChunk += (currentChunk ? "\n\n" : "") + trimmed;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
        // Keep overlap from the end of current chunk
        const overlapText = currentChunk.slice(-overlapChars);
        currentChunk = overlapText + "\n\n" + trimmed;
      } else {
        // Single paragraph exceeds limit — force-split by sentences
        const sentences = trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed];
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length <= charLimit) {
            currentChunk += sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk.trim());
            currentChunk = sentence;
          }
        }
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((c) => c.length > 20); // discard trivially small chunks
}

/**
 * Strip markdown formatting to get plain text for embedding.
 */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")   // code blocks
    .replace(/`[^`]+`/g, " ")           // inline code
    .replace(/!\[.*?\]\(.*?\)/g, " ")   // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1") // links → text
    .replace(/#{1,6}\s*/g, "")          // headings
    .replace(/[*_~]+/g, "")            // bold/italic/strikethrough
    .replace(/>\s*/g, "")              // blockquotes
    .replace(/[-*+]\s+/g, "")         // list markers
    .replace(/\|/g, " ")              // table pipes
    .replace(/\s+/g, " ")             // collapse whitespace
    .trim();
}
