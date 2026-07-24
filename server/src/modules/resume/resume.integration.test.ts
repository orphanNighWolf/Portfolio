import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { ResumeData } from "./resume.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_resume_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Resume Module Integration Tests", () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await ResumeData.deleteMany({});

    // Seed clean resume record
    await ResumeData.create({
      personalInfo: {
        name: "Alex Test",
        email: "test@test.com",
        title: "Test Engineer",
        summary: "A reliable validation test engineer.",
      },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certificates: [],
    });

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await ResumeData.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/resume (Public) - should get structured resume JSON", async () => {
    const res = await request(app).get("/api/resume");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.personalInfo.name).toBe("Alex Test");
  });

  it("GET /api/resume/pdf (Public) - should retrieve valid PDF document stream", async () => {
    const res = await request(app).get("/api/resume/pdf");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("application/pdf");
    
    // Convert body to Buffer and verify it has bytes
    const pdfBuffer = Buffer.from(res.body);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it("PUT /api/resume (Admin) - should update resume data", async () => {
    const payload = {
      personalInfo: {
        name: "Alex Mercer",
        email: "alex@mercer.com",
        title: "Systems Architect",
        summary: "Refactored summary data.",
      },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certificates: [],
    };

    const res = await request(app)
      .put("/api/resume")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.personalInfo.name).toBe("Alex Mercer");
  });
});
