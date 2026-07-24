import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { Visit } from "../modules/analytics/visit.model";

const SALT = process.env.ANALYTICS_SALT || "portfolio_default_salt_key_123";

/**
 * Express middleware to track visitor page views gracefully.
 * Does not block the request even if saving fails.
 */
export function trackVisit(req: Request, _res: Response, next: NextFunction): void {
  // Only log GET requests to pages, avoiding APIs, assets, and admin paths
  const path = req.path;
  if (
    req.method !== "GET" ||
    path.startsWith("/api") ||
    path.startsWith("/admin") ||
    path.includes(".") // ignore static assets
  ) {
    return next();
  }

  const ip = (req.headers["x-forwarded-for"] as string) || req.ip || req.socket.remoteAddress || "";
  const userAgent = req.headers["user-agent"] as string || "";
  const referrer = req.headers["referer"] as string || "";

  // Privacy protection: build a session hash
  const sessionHash = crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}-${SALT}`)
    .digest("hex");

  // Save the visit log asynchronously. Failures must never block the client.
  Visit.create({
    path,
    referrer,
    userAgent,
    sessionHash,
    timestamp: new Date(),
  }).catch((err) => {
    // Log the error locally but do not raise it to the client
    console.error("Asynchronous analytics logger encountered a write failure:", err.message);
  });

  next();
}
