import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { Research } from "../research/research.model";
import { Blog } from "../blogs/blogs.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_shared_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

const testCases = [
  {
    name: "Research",
    route: "/api/research",
    model: Research,
    seedData: [
      {
        title: "Published Paper One",
        category: "Systems",
        tags: ["Rust", "Inference"],
        readingTime: 10,
        markdownContent: "Markdown body.",
        bookmarked: false,
        status: "published",
      },
      {
        title: "Draft Research Two",
        category: "AI",
        tags: ["Python", "TensorFlow"],
        readingTime: 15,
        markdownContent: "Markdown body draft.",
        bookmarked: true,
        status: "draft",
      },
    ],
    searchQuery: "One",
    searchTag: "Rust",
    createPayload: {
      title: "New Paper Three",
      category: "Systems",
      tags: ["Go"],
      readingTime: 5,
      markdownContent: "Brand new",
      bookmarked: false,
      status: "published",
    },
    updatePayload: {
      title: "Updated Paper One",
      category: "Systems",
      tags: ["Rust", "Inference"],
      readingTime: 10,
      markdownContent: "Markdown body edited.",
      bookmarked: false,
      status: "published",
    },
  },
  {
    name: "Blog",
    route: "/api/blogs",
    model: Blog,
    seedData: [
      {
        title: "Published Blog One",
        category: "Tech",
        tags: ["React", "Typescript"],
        readingTime: 6,
        markdownContent: "Markdown post.",
        featured: true,
        relatedBlogSlugs: [],
        status: "published",
      },
      {
        title: "Draft Blog Two",
        category: "Hardware",
        tags: ["Verilog", "FPGAs"],
        readingTime: 20,
        markdownContent: "Markdown post draft.",
        featured: false,
        relatedBlogSlugs: [],
        status: "draft",
      },
    ],
    searchQuery: "One",
    searchTag: "React",
    createPayload: {
      title: "New Blog Three",
      category: "Tech",
      tags: ["Node"],
      readingTime: 8,
      markdownContent: "Brand new blog",
      featured: false,
      relatedBlogSlugs: [],
      status: "published",
    },
    updatePayload: {
      title: "Updated Blog One",
      category: "Tech",
      tags: ["React", "Typescript"],
      readingTime: 6,
      markdownContent: "Markdown post edited.",
      featured: true,
      relatedBlogSlugs: [],
      status: "published",
    },
  },
];

describe("Shared CRUD Integration Tests", () => {
  let adminToken: string;
  let visitorToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    
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
    await mongoose.connection.close();
  });

  for (const tc of testCases) {
    describe(`${tc.name} CRUD + Pagination + Filtering`, () => {
      beforeAll(async () => {
        await tc.model.deleteMany({});
        await tc.model.create(tc.seedData);
      });

      afterAll(async () => {
        await tc.model.deleteMany({});
      });

      it("GET (Public) - should only fetch published items", async () => {
        const res = await request(app).get(tc.route);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(1);
        expect(res.body.data[0].title).toContain("One");
      });

      it("GET (Admin) - should fetch all items including drafts", async () => {
        const res = await request(app)
          .get(tc.route)
          .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
      });

      it("GET (Search) - should filter results by search query", async () => {
        const res = await request(app)
          .get(tc.route)
          .query({ search: tc.searchQuery });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0].title).toContain(tc.searchQuery);
      });

      it("GET (Tag) - should filter results by tag", async () => {
        const res = await request(app)
          .get(tc.route)
          .query({ tag: tc.searchTag });
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0].tags).toContain(tc.searchTag);
      });

      it("GET (Slug) - public request for draft should return 404", async () => {
        const res = await request(app).get(`${tc.route}/draft-${tc.name.toLowerCase()}-two`);
        expect(res.status).toBe(404);
      });

      it("GET (Slug) - admin request for draft should return 200", async () => {
        const res = await request(app)
          .get(`${tc.route}/draft-${tc.name.toLowerCase()}-two`)
          .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.data.title).toContain("Two");
      });

      it("POST (Admin) - should create new item", async () => {
        const res = await request(app)
          .post(tc.route)
          .set("Authorization", `Bearer ${adminToken}`)
          .send(tc.createPayload);
        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe(tc.createPayload.title);

        const count = await tc.model.countDocuments({ title: tc.createPayload.title });
        expect(count).toBe(1);
      });

      it("POST (Visitor) - should deny access with 403", async () => {
        const res = await request(app)
          .post(tc.route)
          .set("Authorization", `Bearer ${visitorToken}`)
          .send(tc.createPayload);
        expect(res.status).toBe(403);
      });

      it("PUT (Admin) - should edit existing item", async () => {
        const existing = await tc.model.findOne({ title: tc.seedData[0].title });
        expect(existing).toBeDefined();

        const res = await request(app)
          .put(`${tc.route}/${existing!._id}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .send(tc.updatePayload);
        expect(res.status).toBe(200);
        expect(res.body.data.title).toBe(tc.updatePayload.title);
      });

      it("DELETE (Admin) - should delete entry", async () => {
        const existing = await tc.model.findOne({ title: tc.createPayload.title });
        expect(existing).toBeDefined();

        const res = await request(app)
          .delete(`${tc.route}/${existing!._id}`)
          .set("Authorization", `Bearer ${adminToken}`);
        expect(res.status).toBe(200);

        const count = await tc.model.countDocuments({ title: tc.createPayload.title });
        expect(count).toBe(0);
      });
    });
  }
});
