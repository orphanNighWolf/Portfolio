import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../../app";
import { GlobalSettings } from "./settings.model";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_settings_integration_test";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

describe("Settings Module Integration Tests", () => {
  let adminToken: string;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await GlobalSettings.deleteMany({});

    adminToken = jwt.sign(
      { id: new mongoose.Types.ObjectId().toString(), email: "admin@test.com", role: "admin" },
      JWT_ACCESS_SECRET
    );
  });

  afterAll(async () => {
    await GlobalSettings.deleteMany({});
    await mongoose.connection.close();
  });

  it("GET /api/settings (Public) - should return default settings (auto-created)", async () => {
    const res = await request(app).get("/api/settings");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data.darkModeDefault).toBe(true);
    expect(res.body.data.language).toBe("en");
    expect(res.body.data.soundToggle).toBe(true);
    expect(res.body.data.animationToggle).toBe(true);
  });

  it("PUT /api/settings (Admin) - should update global settings", async () => {
    const payload = {
      darkModeDefault: false,
      language: "fr",
      soundToggle: false,
      animationToggle: true,
      accessibilityOptions: { screenReaderFriendly: true, highContrast: false },
      themeTokens: { primaryColor: "#ff6600", secondaryColor: "#0066ff" },
    };

    const res = await request(app)
      .put("/api/settings")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.data.darkModeDefault).toBe(false);
    expect(res.body.data.language).toBe("fr");
    expect(res.body.data.themeTokens.primaryColor).toBe("#ff6600");
  });

  it("PUT /api/settings (No Auth) - should reject unauthenticated requests", async () => {
    const payload = {
      darkModeDefault: true,
      language: "en",
      soundToggle: true,
      animationToggle: true,
      accessibilityOptions: { screenReaderFriendly: false, highContrast: false },
      themeTokens: { primaryColor: "#00e5ff", secondaryColor: "#ff007f" },
    };

    const res = await request(app).put("/api/settings").send(payload);
    expect(res.status).toBe(401);
  });
});
