import dotenv from "dotenv";
import path from "path";

// Resolve path to load environment variables from the server folder
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import { User } from "../modules/auth/auth.model";
import { AuthService } from "../modules/auth/auth.service";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    logger.error("ADMIN_EMAIL or ADMIN_PASSWORD is not set in environment variables.");
    process.exit(1);
  }

  try {
    logger.info("Connecting to database for seeding...");
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to database.");

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
    const passwordHash = await AuthService.hashPassword(ADMIN_PASSWORD);
    if (existingAdmin) {
      logger.info(`Admin user with email ${ADMIN_EMAIL} already exists. Updating password...`);
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      logger.info("Admin password successfully updated.");
    } else {
      logger.info(`Creating admin user: ${ADMIN_EMAIL}...`);
      await User.create({
        email: ADMIN_EMAIL.toLowerCase().trim(),
        passwordHash,
        role: "admin",
      });
      logger.info("Admin user successfully seeded.");
    }
  } catch (error) {
    logger.error({ err: error }, "Failed to seed admin user");
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed.");
  }
}

seedAdmin();
