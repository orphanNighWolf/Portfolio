import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { User } from "./auth.model";
import { AuthService } from "./auth.service";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_integration_test";

describe("Auth Integration Tests", () => {
  const testEmail = "testuser@domain.com";
  const testPassword = "securePassword123";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await User.deleteMany({});

    const passwordHash = await AuthService.hashPassword(testPassword);
    await User.create({
      email: testEmail,
      passwordHash,
      role: "visitor",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("POST /api/auth/login - should log in successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.user.role).toBe("visitor");

    const cookies = (res.headers["set-cookie"] || []) as string[];
    const hasRefreshTokenCookie = cookies.some((cookie: string) => cookie.includes("refreshToken="));
    expect(hasRefreshTokenCookie).toBe(true);
  });

  it("POST /api/auth/login - should fail with invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testEmail, password: "wrongPassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("POST /api/auth/login - should fail with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "ghost@domain.com", password: testPassword });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });

  it("POST /api/auth/login - should fail Zod validation with invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid-email", password: testPassword });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Validation error");
  });
});
