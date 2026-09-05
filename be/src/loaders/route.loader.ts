import { Express } from "express";
import logger from "../utils/logger.js";
import { BASE_PATH, V1 } from "../common/constants/path.constants.js";
import apiV1 from "../api/v1/index.js";
const routeHandler = ({ app }: { app: Express }) => {
  logger.info("Starting Execution Route Loader");
  try {
    app.use(`${BASE_PATH}${V1}`, apiV1);
  } catch (error: any) {
    logger.error("Error Occurred While Executing routeLoader", error);
    throw error;
  }
};
export default routeHandler;
