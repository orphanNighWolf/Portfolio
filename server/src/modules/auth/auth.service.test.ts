import { describe, it, expect, beforeAll, afterAll } from "vitest";
import mongoose from "mongoose";
import { AuthService } from "./auth.service";
import { User } from "./auth.model";
import jwt from "jsonwebtoken";

const MONGO_URI = "mongodb://127.0.0.1:27017/portfolio_test";

describe("AuthService Unit Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should hash and verify passwords correctly", async () => {
    const password = "mySecurePassword123";
    const hash = await AuthService.hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    
    const isValid = await AuthService.verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await AuthService.verifyPassword("wrongPassword", hash);
    expect(isInvalid).toBe(false);
  });

  it("should generate access token with correct payload", () => {
    const mockUser = new User({
      email: "test@domain.com",
      passwordHash: "somehash",
      role: "admin",
    });

    const token = AuthService.generateAccessToken(mockUser);
    expect(token).toBeDefined();

    const decoded = jwt.decode(token) as { email: string; role: string; id: string };
    expect(decoded.email).toBe(mockUser.email);
    expect(decoded.role).toBe(mockUser.role);
    expect(decoded.id).toBe(mockUser._id.toString());
  });

  it("should generate, verify, and refresh refresh tokens", async () => {
    const mockUser = await User.create({
      email: "refresh-test@domain.com",
      passwordHash: "somehash",
      role: "visitor",
    });

    const token = await AuthService.generateRefreshToken(mockUser);
    expect(token).toBeDefined();

    const updatedUser = await User.findById(mockUser._id);
    expect(updatedUser?.refreshTokenHash).toBeDefined();
    expect(updatedUser?.refreshTokenHash).not.toBeNull();

    const refreshedUser = await AuthService.verifyAndRefresh(token);
    expect(refreshedUser.email).toBe(mockUser.email);

    await AuthService.revokeRefreshToken(refreshedUser);
    const loggedOutUser = await User.findById(mockUser._id);
    expect(loggedOutUser?.refreshTokenHash).toBeNull();
  });
});
