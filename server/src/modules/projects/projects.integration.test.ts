import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Project } from "./projects.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_projects_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Projects API Integration Tests", () => {
  let adminToken: string;
  let visitorToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await Project.deleteMany({});

    await Project.create({
      title: "Published Web Service",
      category: "Frontend",
      tags: ["React", "Vite"],
      shortDescription: "A published project description.",
      problemStatement: "Problem solved.",
      solution: "Solution description.",
      challenges: "Challenges faced.",
      futureImprovements: "Future roadmap.",
      techStack: ["React", "TypeScript"],
      featured: true,
      status: "published",
    });

    await Project.create({
      title: "Draft ML System",
      category: "Artificial Intelligence",
      tags: ["Python", "PyTorch"],
      shortDescription: "A draft project description.",
      problemStatement: "Problem solved.",
      solution: "Solution description.",
      challenges: "Challenges faced.",
      futureImprovements: "Future roadmap.",
      techStack: ["Python", "PyTorch"],
      featured: false,
      status: "draft",
    });

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
    visitorToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "visitor@test.com", role: "visitor" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/projects (Public) - should only return published projects", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Published Web Service");
  });

  it("GET /api/projects (Admin) - should return all projects including drafts", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("GET /api/projects?search=web - should search title case-insensitively", async () => {
    const res = await request(app).get("/api/projects").query({ search: "web" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe("Published Web Service");
  });

  it("GET /api/projects?tag=Vite - should filter by tags array content", async () => {
    const res = await request(app).get("/api/projects").query({ tag: "Vite" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("GET /api/projects/:slug (Public) - should hide draft project and return 404", async () => {
    const res = await request(app).get("/api/projects/draft-ml-system");
    expect(res.status).toBe(404);
  });

  it("GET /api/projects/:slug (Admin) - should retrieve draft project", async () => {
    const res = await request(app)
      .get("/api/projects/draft-ml-system")
      .set("Authorization", `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Draft ML System");
  });

  it("POST /api/projects - should fail for visitors", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${visitorToken}`)
      .send({
        title: "Forbidden Project",
        category: "Backend",
        shortDescription: "Short",
        problemStatement: "Problem",
        solution: "Solution",
        challenges: "Challenges",
        futureImprovements: "Future",
        techStack: ["Node"],
        status: "published",
      });

    expect(res.status).toBe(403);
  });

  it("POST /api/projects - should create a project with auto slug for admins", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "New AI Platform",
        category: "Artificial Intelligence",
        shortDescription: "Platform short description.",
        problemStatement: "Problem solved.",
        solution: "Solution description.",
        challenges: "Challenges faced.",
        futureImprovements: "Future roadmap.",
        techStack: ["TensorFlow", "FastAPI"],
        status: "published",
      });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe("new-ai-platform");
  });
});
