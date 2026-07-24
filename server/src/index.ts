import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/db";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Database connection with exponential retry logic
    await connectDatabase();

    // Start HTTP listener
    app.listen(PORT, () => {
      logger.info(`Server successfully started on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    });
  } catch (error) {
    logger.fatal({ err: error }, "Crash during server initialization startup");
    process.exit(1);
  }
}

// Capture runtime promise errors
process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled Promise Rejection");
});

process.on("uncaughtException", (error) => {
  logger.fatal({ err: error }, "Uncaught Exception error; terminating process");
  process.exit(1);
});

startServer();
