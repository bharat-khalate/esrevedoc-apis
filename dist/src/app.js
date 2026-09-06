import express from "express";
import expressLoader from "./loaders/express.loader.js";
import { responseHandler } from "./middlewares/responseHandler.js";
import path from "node:path";
import routeHandler from "./loaders/route.loader.js";
import errorHandler from "./middlewares/errorHandler.js";
import { setupSwagger } from "./config/sawgger.config.js";
import { basicAuthMiddleware } from "./middlewares/auth.middleware.js";
const app = express();
app.use(responseHandler);
expressLoader({ app });
setupSwagger(app);
app.use(
  "/.well-known",
  express.static(path.join(process.cwd(), "src/assets/.well-known")),
);
app.use(basicAuthMiddleware);
routeHandler({ app });
app.use(errorHandler);
export default app;
