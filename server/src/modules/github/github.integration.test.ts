import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { GitHubCache } from "./github.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_github_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("GitHub Integration API Tests", () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await GitHubCache.deleteMany({});

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await GitHubCache.deleteMany({});
    await mongoose.connection.close();
  });

  it("should serve fallback default structure if GitHub API fails and cache is empty", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("GitHub API Offline"));

    const res = await request(app).get("/api/github/overview");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.username).toBe("alex-mercer");
    expect(res.body.data.profile.name).toBe("Alex Mercer");
    expect(res.body.data.repos.length).toBeGreaterThan(0);

    fetchSpy.mockRestore();
  });

  it("should serve freshly fetched GitHub data and cache it on successful API call", async () => {
    const mockProfile = { name: "Mock User", login: "mock-user", followers: 50, public_repos: 5, html_url: "http://github/mock" };
    const mockRepos = [
      { name: "Mock Repo", description: "Desc", html_url: "http://github/mock/repo", stargazers_count: 10, forks_count: 2, language: "TypeScript", updated_at: "2026-07-02" }
    ];
    const mockEvents = [
      { type: "PushEvent", repo: { name: "mock-user/mock-repo" }, payload: { commits: [{ message: "Initial commit" }] }, created_at: "2026-07-02" }
    ];

    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation((url: any) => {
      let data: any = {};
      if (url.includes("/events")) {
        data = mockEvents;
      } else if (url.includes("/repos")) {
        data = mockRepos;
      } else {
        data = mockProfile;
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data)
      } as Response);
    });

    const res = await request(app).get("/api/github/overview");
    expect(res.status).toBe(200);
    expect(res.body.data.profile.name).toBe("Mock User");
    expect(res.body.data.repos[0].name).toBe("Mock Repo");
    expect(res.body.data.languages.TypeScript).toBe(1);

    const cached = await GitHubCache.findOne({ username: "alex-mercer" });
    expect(cached).toBeDefined();
    expect((cached as any).profile.name).toBe("Mock User");

    fetchSpy.mockRestore();
  });

  it("should serve cached snapshot from DB when API is offline and cache has entries", async () => {
    await GitHubCache.findOneAndUpdate(
      { username: "alex-mercer" },
      {
        username: "alex-mercer",
        profile: { name: "Cached Local User", htmlUrl: "http://github/cached" },
        repos: [],
        languages: {},
        recentActivity: [],
      },
      { upsert: true }
    );

    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("GitHub Rate Limited"));

    const res = await request(app).get("/api/github/overview");
    expect(res.status).toBe(200);
    expect(res.body.data.profile.name).toBe("Cached Local User");

    fetchSpy.mockRestore();
  });

  it("POST /api/github/refresh - should require admin auth and invalidate cache", async () => {
    const mockProfile = { name: "Admin Refreshed User", login: "mock-user", followers: 50, public_repos: 5, html_url: "http://github/mock" };
    const mockRepos: any[] = [];
    const mockEvents: any[] = [];

    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation((url: any) => {
      let data: any = {};
      if (url.includes("/events")) {
        data = mockEvents;
      } else if (url.includes("/repos")) {
        data = mockRepos;
      } else {
        data = mockProfile;
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(data)
      } as Response);
    });

    const res = await request(app)
      .post("/api/github/refresh")
      .set("Authorization", `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cache successfully refreshed");
    expect(res.body.data.profile.name).toBe("Admin Refreshed User");

    fetchSpy.mockRestore();
  });
});
