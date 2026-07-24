import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Visit } from "./visit.model";
import { Project } from "../projects/projects.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_analytics_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Analytics & Visitor Tracking Integration Tests", () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await Visit.deleteMany({});
    await Project.deleteMany({});

    // Seed a project so we have countable data for the summary
    await Project.create({
      title: "Analytics Test Project",
      category: "Test",
      tags: ["test"],
      shortDescription: "For analytics count testing",
      problemStatement: "N/A",
      solution: "N/A",
      challenges: "N/A",
      futureImprovements: "N/A",
      techStack: ["Node"],
    });

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await Visit.deleteMany({});
    await Project.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/admin/summary - should return aggregate counts (admin-only)", async () => {
    const res = await request(app)
      .get("/api/admin/summary")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("projectsCount");
    expect(res.body.data).toHaveProperty("blogsCount");
    expect(res.body.data).toHaveProperty("unreadMessages");
    expect(res.body.data).toHaveProperty("pendingBookings");
    expect(res.body.data).toHaveProperty("visitsThisWeek");
    expect(res.body.data.projectsCount).toBeGreaterThanOrEqual(1);
  });

  it("GET /api/analytics/overview - should return visits over time and top pages (admin-only)", async () => {
    const res = await request(app)
      .get("/api/analytics/overview")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("visitsOverTime");
    expect(res.body.data).toHaveProperty("topPages");
    expect(res.body.data).toHaveProperty("topReferrers");
    expect(Array.isArray(res.body.data.visitsOverTime)).toBe(true);
  });

  it("Visitor tracking middleware - should not block the request even if DB write fails", async () => {
    // Simulate a DB write failure by temporarily stubbing Visit.create to reject
    const originalCreate = Visit.create.bind(Visit);
    const createSpy = vi.spyOn(Visit, "create").mockRejectedValue(new Error("Simulated DB failure"));

    // Make a GET request to a non-API path (the middleware only tracks non-API GET requests)
    // Since supertest sends requests to the express app directly, we hit a page-like route
    const res = await request(app).get("/some-page");

    // The request should still complete — NOT a 500
    // It will be a 404 (no route matches /some-page), which is fine — the key assertion
    // is that it's not a 500 caused by the analytics middleware crashing the pipeline
    expect(res.status).not.toBe(500);

    // Verify the spy was called (the middleware tried to save)
    expect(createSpy).toHaveBeenCalled();

    // Restore
    createSpy.mockRestore();
  });
});
