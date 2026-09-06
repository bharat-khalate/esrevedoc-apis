import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJSDoc from "swagger-jsdoc";
import { PORT } from "../common/constants/env.js";
import { BASE_PATH, V1 } from "../common/constants/path.constants.js";
import logger from "../utils/logger.js";
import swaggerUi from "swagger-ui-express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ESEREVEDOC Backend APIs",
      version: "1.0.0",
      description: "API documentation for the ESEREVEDOC project",
    },
    servers: [
      {
        url: `http://localhost:${PORT}${BASE_PATH}${V1}`,
        description: `Local server (${V1} API)`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, "../modules/**/*.routes.{js,ts}")],
};
const swaggerDoc = swaggerJSDoc(options);
/**
 * Mounts the Swagger UI and JSON spec onto the Express application.
 * Available at /api-docs in all environments.
 * @param {import('express').Application} app - The Express application instance.
 * @returns {void}
 */
export const setupSwagger = (app) => {
  logger.info("Starting Execution of setupSwagger Configuration");
  try {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    logger.info(`Swagger Ui available at ${BASE_PATH}${V1}/api-docs`);
  } catch (err) {
    logger.error("Error While Executing the setupSwagger Configuration", err);
    throw err;
  }
};
