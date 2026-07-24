import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Skill } from "./skills.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_skills_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Skills API Integration Tests", () => {
  let adminToken: string;
  let visitorToken: string;
  let testSkillId: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await Skill.deleteMany({});

    const testSkill = await Skill.create({
      name: "React Test",
      category: "Frontend",
      level: 90,
      yearsExperience: 4,
      description: "React Testing Library components.",
      featured: true,
    });
    testSkillId = testSkill._id.toString();

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
    await Skill.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/skills - should retrieve list of skills", async () => {
    const res = await request(app).get("/api/skills");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe("React Test");
  });

  it("GET /api/skills?category=Programming - should return empty if no match", async () => {
    const res = await request(app).get("/api/skills").query({ category: "Programming" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("GET /api/skills?search=react - should match name case-insensitively", async () => {
    const res = await request(app).get("/api/skills").query({ search: "react" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("POST /api/skills - should deny access if unauthenticated", async () => {
    const res = await request(app)
      .post("/api/skills")
      .send({ name: "Python", category: "Programming", level: 85, yearsExperience: 3 });
    expect(res.status).toBe(401);
  });

  it("POST /api/skills - should deny access if not admin", async () => {
    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${visitorToken}`)
      .send({ name: "Python", category: "Programming", level: 85, yearsExperience: 3 });
    expect(res.status).toBe(403);
  });

  it("POST /api/skills - should create a new skill as admin", async () => {
    const res = await request(app)
      .post("/api/skills")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Python", category: "Programming", level: 85, yearsExperience: 3 });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe("Python");
  });

  it("PUT /api/skills/:id - should update the skill level as admin", async () => {
    const res = await request(app)
      .put(`/api/skills/${testSkillId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "React Test", category: "Frontend", level: 95, yearsExperience: 4 });

    expect(res.status).toBe(200);
    expect(res.body.data.level).toBe(95);
  });

  it("DELETE /api/skills/:id - should delete the skill as admin", async () => {
    const res = await request(app)
      .delete(`/api/skills/${testSkillId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Skill successfully deleted");
  });
});
