import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "admin" | "visitor";
  };
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new AppError("Authorization token required", 401));
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      id: string;
      email: string;
      role: "admin" | "visitor";
    };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Authorization token expired", 401));
    } else {
      next(new AppError("Invalid authorization token", 401));
    }
  }
}

export function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AppError("Authentication required", 401));
    return;
  }

  if (req.user.role !== "admin") {
    next(new AppError("Forbidden: Admin access required", 403));
    return;
  }

  next();
}
