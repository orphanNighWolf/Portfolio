import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { Project } from "../projects/projects.model";
import { Blog } from "../blogs/blogs.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_search_integration_test";

describe("Global Search Integration Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await Project.deleteMany({});
    await Blog.deleteMany({});

    // Build schema text indexes synchronously to avoid index latency errors
    await Project.ensureIndexes();
    await Blog.ensureIndexes();

    // Seed dummy entries with distinct terms to check index relevance
    await Project.create({
      title: "Local Quantum Engine Sandbox",
      category: "Systems",
      tags: ["Rust", "WASM"],
      shortDescription: "A fast sandboxed execution loop.",
      problemStatement: "None",
      solution: "None",
      challenges: "None",
      futureImprovements: "None",
      techStack: ["Rust"],
    });

    await Blog.create({
      title: "Building localized microservices with Node",
      category: "Backend",
      tags: ["JavaScript"],
      readingTime: 5,
      markdownContent: "Exploring microservices architecture patterns.",
      status: "published",
    });
  });

  afterAll(async () => {
    await Project.deleteMany({});
    await Blog.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/search - should return empty structures if query parameter is empty", async () => {
    const res = await request(app).get("/api/search").query({ q: "" });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.projects).toHaveLength(0);
  });

  it("GET /api/search - should match seeded project by indexed title keyword", async () => {
    const res = await request(app).get("/api/search").query({ q: "Quantum" });
    expect(res.status).toBe(200);
    expect(res.body.data.projects.length).toBeGreaterThan(0);
    expect(res.body.data.projects[0].title).toBe("Local Quantum Engine Sandbox");
  });

  it("GET /api/search - should match seeded blog by indexed content details", async () => {
    const res = await request(app).get("/api/search").query({ q: "microservices" });
    expect(res.status).toBe(200);
    expect(res.body.data.blogs.length).toBeGreaterThan(0);
    expect(res.body.data.blogs[0].title).toBe("Building localized microservices with Node");
  });
});
