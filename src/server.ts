import { PORT } from "./common/constants/env.js";
import prisma, { closeDb, connectDb } from "./config/db.config.js";
import logger from "./utils/logger.js";
import http from "node:http";
import expressApp from "./app.js";

const createServer = async () => {
  logger.info("Creating Server....");

  try {
    await connectDb();

    const port = Number(PORT);
    if (!Number.isInteger(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid PORT value: ${PORT}`);
    }

    const httpServer = http.createServer(expressApp);
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      httpServer.close(async () => {
        await closeDb();
        logger.info("HTTP server and database connection closed");
        process.exit(0);
      });
    };

    httpServer.once("error", (error) => {
      logger.error("HTTP server failed to start", error);
      process.exit(1);
    });

    process.once("SIGTERM", () => void shutdown("SIGTERM"));
    process.once("SIGINT", () => void shutdown("SIGINT"));

    httpServer.listen(port, "0.0.0.0", () => {
      logger.info(`Server started on 0.0.0.0:${port}`);
    });
  } catch (error: any) {
    logger.error("Error Occurred While Starting Server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

createServer();
