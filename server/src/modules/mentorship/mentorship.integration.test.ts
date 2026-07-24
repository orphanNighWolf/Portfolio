import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { MentorshipService, MentorshipBooking, MentorshipConfig } from "./mentorship.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_mentorship_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Mentorship Module Integration Tests", () => {
  let adminToken: string;
  let visitorToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await MentorshipService.deleteMany({});
    await MentorshipBooking.deleteMany({});
    await MentorshipConfig.deleteMany({});

    await MentorshipService.create({
      title: "1-on-1 Consultation Session",
      description: "Mentoring session description.",
      price: 100,
      duration: "60 Min",
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
    await MentorshipService.deleteMany({});
    await MentorshipBooking.deleteMany({});
    await MentorshipConfig.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/mentorship (Public) - should retrieve services catalog and settings config", async () => {
    const res = await request(app).get("/api/mentorship");
    expect(res.status).toBe(200);
    expect(res.body.data.services).toHaveLength(1);
    expect(res.body.data.config.testimonials).toBeDefined();
    expect(res.body.data.config.faqs).toBeDefined();
  });

  it("POST /api/mentorship/book (Public) - should submit booking request with validation", async () => {
    const payload = {
      name: "Alice Developer",
      email: "alice@test.com",
      service: "1-on-1 Consultation Session",
      preferredDate: "2026-07-15",
      time: "10:00 AM PST",
      message: "Looking forward to engineering reviews.",
    };

    const res = await request(app).post("/api/mentorship/book").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe(payload.name);

    const doc = await MentorshipBooking.findOne({ email: payload.email });
    expect(doc).toBeDefined();
    expect(doc!.status).toBe("pending");
  });

  it("GET /api/mentorship/bookings (Admin) - should fetch bookings log list", async () => {
    const res = await request(app)
      .get("/api/mentorship/bookings")
      .set("Authorization", `Bearer ${adminToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("GET /api/mentorship/bookings (Visitor) - should forbid request with 403", async () => {
    const res = await request(app)
      .get("/api/mentorship/bookings")
      .set("Authorization", `Bearer ${visitorToken}`);
    
    expect(res.status).toBe(403);
  });

  it("PUT /api/mentorship/config (Admin) - should update config testimonials and FAQs", async () => {
    const payload = {
      testimonials: [
        { name: "John Alumni", role: "Dev", text: "Great session", avatarUrl: "http://av" }
      ],
      faqs: [
        { question: "Is the session conducted remotely?", answer: "Yes, all sessions are completely remote." }
      ]
    };

    const res = await request(app)
      .put("/api/mentorship/config")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.data.testimonials).toHaveLength(1);
    expect(res.body.data.faqs).toHaveLength(1);
  });
});
