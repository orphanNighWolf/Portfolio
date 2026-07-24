import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import { User } from "../modules/auth/auth.model";
import { AuthService } from "../modules/auth/auth.service";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const email = "admin@portfolio.dev";
    const password = "adminPassword123";
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found in DB.");
      return;
    }
    
    console.log("User found. Password hash:", user.passwordHash);
    
    const isMatch = await AuthService.verifyPassword(password, user.passwordHash);
    console.log("Bcrypt comparison match:", isMatch);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

testLogin();
