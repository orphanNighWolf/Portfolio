import { Request, Response, NextFunction } from "express";
import { User } from "./auth.model";
import { AuthService } from "./auth.service";
import { AppError } from "../../middleware/error";

const COOKIE_NAME = "refreshToken";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await AuthService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = AuthService.generateAccessToken(user);
    const refreshToken = await AuthService.generateRefreshToken(user);

    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      status: "success",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (!refreshToken) {
      throw new AppError("Session token missing", 401);
    }

    const user = await AuthService.verifyAndRefresh(refreshToken);

    const newAccessToken = AuthService.generateAccessToken(user);
    const newRefreshToken = await AuthService.generateRefreshToken(user);

    res.cookie(COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (refreshToken) {
      try {
        const user = await AuthService.verifyAndRefresh(refreshToken);
        await AuthService.revokeRefreshToken(user);
      } catch {
        // Silently continue if session verification failed during logout
      }
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      message: "Successfully logged out",
    });
  } catch (error) {
    next(error);
  }
}
