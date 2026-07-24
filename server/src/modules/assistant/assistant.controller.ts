import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { ConversationLog, SUGGESTED_QUESTIONS } from "./assistant.model";
import { buildKnowledgeIndex, getIndexStatus } from "./indexBuilder";
import { searchSimilar, searchByKeyword, getStoreSize } from "./vectorStore";
import { generateQueryEmbedding, streamChat, ChatMessage } from "./llmProvider";

const SYSTEM_PROMPT = `You are a helpful AI assistant embedded in a personal portfolio website. Your purpose is to help visitors learn about the portfolio owner's projects, skills, research, blog posts, and professional background.

IMPORTANT RULES:
1. ONLY answer questions using the context provided below. Do not make up information, projects, or experiences that aren't in the context.
2. If the context doesn't contain enough information to answer the question, say so honestly. Suggest the visitor check the relevant section of the portfolio or use the Contact page to reach out directly.
3. Be conversational, friendly, and concise. Use markdown formatting for clarity.
4. When referencing projects, blogs, or research, mention them by name so the visitor can find them.
5. Never pretend to be the portfolio owner — you are an AI assistant helping visitors learn about them.
6. Keep responses focused and under 300 words unless the visitor asks for detail.`;

/**
 * POST /api/assistant/chat
 * Accepts { message, history[], sessionId } and streams back an SSE response.
 */
export async function chat(req: Request, res: Response, _next: NextFunction): Promise<void> {
  const { message, history = [], sessionId } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ status: "error", message: "Message is required." });
    return;
  }

  // Ensure index is built
  if (getStoreSize() === 0) {
    try {
      await buildKnowledgeIndex();
    } catch (err) {
      console.error("Failed to build knowledge index on-demand:", err);
    }
  }

  // Retrieve relevant context
  let contextText = "";
  try {
    const queryEmbedding = await generateQueryEmbedding(message);
    let relevantChunks;

    if (queryEmbedding.length > 0) {
      relevantChunks = searchSimilar(queryEmbedding, 5);
    } else {
      // Fallback to keyword search
      relevantChunks = searchByKeyword(message, 5);
    }

    if (relevantChunks.length > 0) {
      contextText = relevantChunks
        .map((chunk) => `[Source: ${chunk.sourceTitle} (${chunk.source})]\n${chunk.content}`)
        .join("\n\n---\n\n");
    }
  } catch (err: any) {
    console.warn("Retrieval error:", err.message);
    // Continue without context — LLM will respond with "no info found"
  }

  // Build the prompt messages
  const systemMessage = contextText
    ? `${SYSTEM_PROMPT}\n\n--- PORTFOLIO CONTEXT ---\n${contextText}\n--- END CONTEXT ---`
    : `${SYSTEM_PROMPT}\n\nNote: No relevant portfolio content was found for this query. Please let the visitor know and suggest they explore the portfolio directly or use the Contact page.`;

  const chatMessages: ChatMessage[] = [
    { role: "system", content: systemMessage },
  ];

  // Add conversation history (limited to last 10 messages to control token cost)
  const recentHistory = (history || []).slice(-10);
  for (const msg of recentHistory) {
    if (msg.role === "user" || msg.role === "assistant") {
      chatMessages.push({ role: msg.role, content: msg.content });
    }
  }

  // Add the current user message
  chatMessages.push({ role: "user", content: message });

  // Set up SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  let fullResponse = "";

  try {
    for await (const chunk of streamChat(chatMessages)) {
      if (chunk.content) {
        fullResponse += chunk.content;
        res.write(`data: ${JSON.stringify({ content: chunk.content, done: false })}\n\n`);
      }
      if (chunk.done) {
        res.write(`data: ${JSON.stringify({ content: "", done: true })}\n\n`);
      }
    }
  } catch (err: any) {
    console.error("Streaming error:", err.message);
    res.write(
      `data: ${JSON.stringify({
        content: "\n\nI encountered an error while generating a response. Please try again or visit the [Contact](/contact) page.",
        done: true,
      })}\n\n`
    );
  }

  res.end();

  // Log conversation asynchronously (don't block the response)
  const resolvedSessionId = sessionId || crypto.randomUUID();
  ConversationLog.findOneAndUpdate(
    { sessionId: resolvedSessionId },
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: message },
            { role: "assistant", content: fullResponse },
          ],
        },
      },
      $setOnInsert: {
        metadata: {
          userAgent: req.headers["user-agent"] || "",
          referrer: req.headers["referer"] || "",
        },
      },
    },
    { upsert: true, new: true }
  ).catch((err: any) => {
    console.warn("Failed to log conversation:", err.message);
  });
}

/**
 * POST /api/assistant/rebuild-index (Admin only)
 * Triggers a manual rebuild of the knowledge index.
 */
export async function rebuildIndex(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await buildKnowledgeIndex();
    res.status(200).json({
      status: "success",
      data: {
        chunkCount: result.chunkCount,
        indexedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/assistant/status
 * Returns the current index status and suggested questions.
 */
export async function getStatus(_req: Request, res: Response): Promise<void> {
  const indexStatus = getIndexStatus();
  res.status(200).json({
    status: "success",
    data: {
      ...indexStatus,
      suggestedQuestions: SUGGESTED_QUESTIONS,
    },
  });
}
