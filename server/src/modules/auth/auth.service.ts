import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser, User } from "./auth.model";
import { AppError } from "../../middleware/error";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "local_jwt_access_secret_key_12345";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "local_jwt_refresh_secret_key_12345";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

export class AuthService {
  /**
   * Hashes a plain-text password using bcrypt.
   */
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Compares a plain-text password against a bcrypt hash.
   */
  public static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generates a short-lived access JWT.
   */
  public static generateAccessToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_ACCESS_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRY as unknown as jwt.SignOptions["expiresIn"] }
    );
  }

  /**
   * Generates a long-lived refresh JWT and saves its hash to the user document.
   */
  public static async generateRefreshToken(user: IUser): Promise<string> {
    const token = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRY as unknown as jwt.SignOptions["expiresIn"] }
    );

    const tokenHash = await bcrypt.hash(token, 10);
    user.refreshTokenHash = tokenHash;
    await user.save();

    return token;
  }

  /**
   * Validates a refresh token against the user's stored hash.
   * If valid, returns the user document.
   */
  public static async verifyAndRefresh(token: string): Promise<IUser> {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
      
      const user = await User.findById(decoded.id);
      
      if (!user || !user.refreshTokenHash) {
        throw new AppError("Session expired or user not found", 401);
      }

      const isMatch = await bcrypt.compare(token, user.refreshTokenHash);
      if (!isMatch) {
        throw new AppError("Invalid session credentials", 401);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Invalid or expired session", 401);
    }
  }

  /**
   * Revokes the user's refresh token on logout.
   */
  public static async revokeRefreshToken(user: IUser): Promise<void> {
    user.refreshTokenHash = null;
    await user.save();
  }
}
