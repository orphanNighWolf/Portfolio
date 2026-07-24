import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../app";
import { ContactMessage } from "./contact.model";
import * as resendModule from "../../config/resend";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_contact_integration_test";

describe("Contact Module Integration Tests", () => {
  let emailSpy: any;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_URI);
    }
    await ContactMessage.deleteMany({});
    
    // Mock the sendEmail utility to prevent actual Resend dispatches
    emailSpy = vi.spyOn(resendModule, "sendEmail").mockResolvedValue({ id: "mock_test_resend_id_123" });
  });

  afterAll(async () => {
    await ContactMessage.deleteMany({});
    await mongoose.connection.close();
    emailSpy.mockRestore();
  });

  it("POST /api/contact - should submit message and trigger email notifier", async () => {
    const payload = {
      name: "John Doe",
      email: "john@test.com",
      subject: "Inquiry on Systems consulting",
      message: "Hello, I would like to consult on an AI indexing pipeline setup.",
    };

    const res = await request(app).post("/api/contact").send(payload);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.name).toBe(payload.name);

    // Assert it was saved in Mongo
    const dbMsg = await ContactMessage.findOne({ email: payload.email });
    expect(dbMsg).toBeDefined();
    expect(dbMsg!.subject).toBe(payload.subject);

    // Assert email notifier was triggered
    expect(emailSpy).toHaveBeenCalled();
  });

  it("POST /api/contact (Spam Protection Honeypot) - should silently no-op and not store in DB", async () => {
    const payload = {
      name: "Spam Bot",
      email: "bot@spam.com",
      subject: "Buy cheap tokens",
      message: "Click this link to purchase coins now.",
      honeypot: "automated_form_entry_value", // Bots fill hidden fields
    };

    emailSpy.mockClear();

    const res = await request(app).post("/api/contact").send(payload);
    
    // Should return success status code to deceive the spam bot
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");

    // Message must NOT be saved in Database
    const dbMsg = await ContactMessage.findOne({ email: payload.email });
    expect(dbMsg).toBeNull();

    // Email notification must NOT be fired
    expect(emailSpy).not.toHaveBeenCalled();
  });

  it("POST /api/contact - should fail validation on bad email or missing fields", async () => {
    const payload = {
      name: "",
      email: "not_an_email",
      subject: "Hi",
      message: "Short",
    };

    const res = await request(app).post("/api/contact").send(payload);
    expect(res.status).toBe(400);
  });
});
