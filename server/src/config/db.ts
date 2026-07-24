import mongoose from "mongoose";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 2000;

export async function connectDatabase() {
  let retryCount = 0;
  let delay = INITIAL_RETRY_DELAY_MS;

  const attemptConnect = async (): Promise<void> => {
    try {
      logger.info("Attempting to connect to MongoDB...");
      await mongoose.connect(MONGO_URI);
      logger.info("Successfully connected to MongoDB.");
    } catch (error) {
      retryCount++;
      logger.error({ err: error }, `MongoDB connection failed (Attempt ${retryCount}/${MAX_RETRIES})`);

      if (retryCount < MAX_RETRIES) {
        logger.info(`Retrying connection in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        return attemptConnect();
      } else {
        logger.fatal("Maximum MongoDB connection attempts reached. Shutting down server process.");
        process.exit(1);
      }
    }
  };

  await attemptConnect();
}

export async function closeDatabaseConnection() {
  logger.info("Closing MongoDB connection gracefully...");
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed successfully.");
  } catch (error) {
    logger.error({ err: error }, "Error occurred while closing MongoDB connection");
  }
}

// Register process exit listeners for clean shutdown
process.on("SIGINT", async () => {
  logger.info("SIGINT signal received.");
  await closeDatabaseConnection();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM signal received.");
  await closeDatabaseConnection();
  process.exit(0);
});
