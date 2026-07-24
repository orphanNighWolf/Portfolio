/**
 * Provider-agnostic LLM interface.
 * Supports OpenAI, Gemini, Claude — selectable via LLM_PROVIDER env var.
 * Also handles embedding generation.
 */

import OpenAI from "openai";

// ── Types ──

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

// ── Provider Detection ──

function getProvider(): string {
  return (process.env.LLM_PROVIDER || "openai").toLowerCase();
}

function getApiKey(): string {
  const provider = getProvider();
  switch (provider) {
    case "gemini":
      return process.env.GEMINI_API_KEY || "";
    case "claude":
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY || "";
    case "openai":
    default:
      return process.env.OPENAI_API_KEY || "";
  }
}

function getModel(): string {
  const provider = getProvider();
  switch (provider) {
    case "gemini":
      return process.env.LLM_MODEL || "gemini-2.0-flash";
    case "claude":
    case "anthropic":
      return process.env.LLM_MODEL || "claude-sonnet-4-20250514";
    case "openai":
    default:
      return process.env.LLM_MODEL || "gpt-4o-mini";
  }
}

// ── Embedding Generation ──

/**
 * Generate embeddings for an array of texts.
 * Returns empty arrays if no API key is configured (fallback to keyword search).
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // No API key — return empty embeddings; vectorStore will use keyword fallback
    return texts.map(() => []);
  }

  const client = new OpenAI({ apiKey });
  const embeddingModel = process.env.EMBEDDING_MODEL || "text-embedding-3-small";

  // Batch in groups of 100 (API limit)
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += 100) {
    const batch = texts.slice(i, i + 100);
    const response = await client.embeddings.create({
      model: embeddingModel,
      input: batch,
    });
    for (const item of response.data) {
      results.push(item.embedding);
    }
  }

  return results;
}

/**
 * Generate embedding for a single query text.
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const results = await generateEmbeddings([text]);
  return results[0] || [];
}

// ── LLM Chat Streaming ──

/**
 * Stream a chat completion from the configured LLM provider.
 * Yields string chunks as they arrive.
 */
export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<StreamChunk> {
  const provider = getProvider();
  const apiKey = getApiKey();
  const model = getModel();

  if (!apiKey) {
    yield {
      content: "I apologize, but the AI assistant is not configured yet. Please contact the site owner to set up the LLM provider. In the meantime, feel free to explore the [Projects](/projects), [Blog](/blogs), or [Contact](/contact) pages directly!",
      done: true,
    };
    return;
  }

  try {
    switch (provider) {
      case "gemini":
        yield* streamGemini(messages, apiKey, model);
        break;
      case "claude":
      case "anthropic":
        yield* streamClaude(messages, apiKey, model);
        break;
      case "openai":
      default:
        yield* streamOpenAI(messages, apiKey, model);
        break;
    }
  } catch (error: any) {
    console.error(`LLM provider ${provider} error:`, error.message);
    yield {
      content: "I'm sorry, I encountered an issue while processing your request. Please try again in a moment, or feel free to browse the portfolio directly or [contact the owner](/contact).",
      done: true,
    };
  }
}

// ── OpenAI Implementation ──

async function* streamOpenAI(messages: ChatMessage[], apiKey: string, model: string): AsyncGenerator<StreamChunk> {
  const client = new OpenAI({ apiKey });

  const stream = await client.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    const done = chunk.choices[0]?.finish_reason === "stop";
    if (content || done) {
      yield { content, done };
    }
  }
}

// ── Gemini Implementation (via OpenAI-compatible endpoint) ──

async function* streamGemini(messages: ChatMessage[], apiKey: string, model: string): AsyncGenerator<StreamChunk> {
  const client = new OpenAI({
    apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  const stream = await client.chat.completions.create({
    model,
    messages,
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    const done = chunk.choices[0]?.finish_reason === "stop";
    if (content || done) {
      yield { content, done };
    }
  }
}

// ── Claude Implementation (via OpenAI-compatible endpoint) ──

async function* streamClaude(messages: ChatMessage[], apiKey: string, model: string): AsyncGenerator<StreamChunk> {
  // Anthropic's Messages API — use the OpenAI SDK with a compatible wrapper
  // For production, you'd use the @anthropic-ai/sdk package directly.
  // This uses the OpenAI-compatible endpoint approach for simplicity.
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.anthropic.com/v1/",
    defaultHeaders: {
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
    },
  });

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      stream: true,
      max_tokens: 1024,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      const done = chunk.choices[0]?.finish_reason === "stop";
      if (content || done) {
        yield { content, done };
      }
    }
  } catch {
    // Fallback: if OpenAI-compat doesn't work, yield a helpful error
    yield {
      content: "Claude provider integration requires additional configuration. Please check the API setup.",
      done: true,
    };
  }
}

// ── Mock Provider (for testing) ──

export async function* mockStreamChat(messages: ChatMessage[]): AsyncGenerator<StreamChunk> {
  const lastMessage = messages[messages.length - 1]?.content || "";
  const mockResponse = `This is a mock response to: "${lastMessage.slice(0, 50)}..."`;

  // Simulate streaming word by word
  const words = mockResponse.split(" ");
  for (let i = 0; i < words.length; i++) {
    yield {
      content: (i > 0 ? " " : "") + words[i],
      done: i === words.length - 1,
    };
  }
}
