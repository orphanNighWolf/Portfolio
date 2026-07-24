import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Project } from "../projects/projects.model";
import { Blog } from "../blogs/blogs.model";
import { ConversationLog } from "./assistant.model";
import { searchByKeyword } from "./vectorStore";
import * as llmProvider from "./llmProvider";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_assistant_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

// Mock the LLM provider so tests don't make real API calls
vi.mock("./llmProvider", async (importOriginal) => {
  const original = await importOriginal<typeof import("./llmProvider")>();
  return {
    ...original,
    generateEmbeddings: vi.fn().mockResolvedValue([]),
    generateQueryEmbedding: vi.fn().mockResolvedValue([]),
    streamChat: vi.fn().mockImplementation(async function* (messages: any[]) {
      const lastMsg = messages[messages.length - 1]?.content || "";
      yield { content: `Mock response about: ${lastMsg.slice(0, 30)}`, done: false };
      yield { content: "", done: true };
    }),
  };
});

describe("AI Assistant Integration Tests", () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await ConversationLog.deleteMany({});

    // Seed content for retrieval testing
    await Project.create({
      title: "Neural Network Image Classifier",
      slug: "neural-network-classifier",
      category: "AI/ML",
      tags: ["python", "tensorflow", "deep-learning"],
      shortDescription: "A deep learning image classification system using convolutional neural networks",
      problemStatement: "Building an accurate image classifier for medical imaging",
      solution: "Implemented a CNN with transfer learning using ResNet50 architecture",
      challenges: "Dealing with class imbalance in the medical dataset",
      futureImprovements: "Integrate attention mechanisms for better feature extraction",
      techStack: ["Python", "TensorFlow", "Docker"],
      status: "published",
    });

    await Blog.create({
      title: "Understanding Transformer Architecture",
      slug: "understanding-transformers",
      category: "AI",
      tags: ["transformers", "nlp", "deep-learning"],
      readingTime: 8,
      markdownContent: "# Understanding Transformers\n\nTransformers have revolutionized NLP. The self-attention mechanism allows the model to weigh the importance of different parts of the input sequence.",
      status: "published",
    });

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await ConversationLog.deleteMany({});
    await mongoose.connection.close();
  });

  // ── Test 1: Index rebuild returns chunk counts ──
  it("POST /api/assistant/rebuild-index - should build index from seeded content (admin-only)", async () => {
    const res = await request(app)
      .post("/api/assistant/rebuild-index")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.chunkCount).toBeGreaterThanOrEqual(2); // At least project + blog
    expect(res.body.data.indexedAt).toBeTruthy();
  });

  // ── Test 2: Status endpoint returns index info and suggested questions ──
  it("GET /api/assistant/status - should return index status and suggested questions", async () => {
    const res = await request(app).get("/api/assistant/status");
    expect(res.status).toBe(200);
    expect(res.body.data.chunkCount).toBeGreaterThanOrEqual(2);
    expect(res.body.data.suggestedQuestions).toBeInstanceOf(Array);
    expect(res.body.data.suggestedQuestions.length).toBeGreaterThanOrEqual(3);
  });

  // ── Test 3: Retrieval returns relevant content for matching query ──
  it("Retrieval should find seeded content for a matching keyword query", async () => {
    const results = searchByKeyword("neural network image classifier", 5);
    expect(results.length).toBeGreaterThanOrEqual(1);

    // The top result should be from the Neural Network project
    const topResult = results[0];
    expect(topResult.source).toBe("project");
    expect(topResult.content.toLowerCase()).toContain("neural network");
    expect(topResult.score).toBeGreaterThan(0);
  });

  // ── Test 4: Chat endpoint streams a response (mocked LLM) ──
  it("POST /api/assistant/chat - should stream a response via SSE", async () => {
    const res = await request(app)
      .post("/api/assistant/chat")
      .send({ message: "Tell me about the projects", sessionId: "test-session-1" });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/event-stream");
    expect(res.text).toContain("data:");
    expect(res.text).toContain("Mock response");
  });

  // ── Test 5: Chat validates input ──
  it("POST /api/assistant/chat - should reject empty messages", async () => {
    const res = await request(app)
      .post("/api/assistant/chat")
      .send({ message: "" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("required");
  });

  // ── Test 6: Graceful degradation when LLM fails ──
  it("POST /api/assistant/chat - should degrade gracefully if LLM throws", async () => {
    // Make streamChat throw an error
    const streamChatMock = vi.mocked(llmProvider.streamChat);
    streamChatMock.mockImplementationOnce(async function* () {
      throw new Error("LLM provider is down");
    });

    const res = await request(app)
      .post("/api/assistant/chat")
      .send({ message: "What projects do you have?", sessionId: "test-session-fail" });

    expect(res.status).toBe(200);
    // Should still get SSE format with a graceful error message
    expect(res.text).toContain("data:");
    expect(res.text).toContain("error");
  });

  // ── Test 7: Index rebuild requires admin auth ──
  it("POST /api/assistant/rebuild-index - should reject unauthenticated requests", async () => {
    const res = await request(app).post("/api/assistant/rebuild-index");
    expect(res.status).toBe(401);
  });
});
