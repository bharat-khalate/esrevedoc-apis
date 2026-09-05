import { PORT } from "./common/constants/env.js";
import { connectDb } from "./config/db.config.js";
import logger from "./utils/logger.js";
import http from "node:http";
import expressApp from "./app.js";
const createServer = async () => {
  logger.info("Creating Server....");
  try {
    await connectDb();
    const port = PORT;
    const httpServer = await http.createServer(expressApp);
    httpServer.listen(port, () => {
      logger.info(`Server Started On Port ${port}`);
    });
  } catch (error: any) {
    logger.error("Error Occurred While Starting Server", error);
    process.exit(1);
  }
};
createServer();
