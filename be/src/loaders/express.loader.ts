import express, { Express } from "express";
import cors from "cors";
import logger from "../utils/logger.js";
const expressLoader = async ({ app }: { app: Express }) => {
  try {
    logger.info("Starting Execution Of Express Loader");
    app.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "appAccessToken",
          "uuid",
          "hashkey",
          "language",
        ],
      }),
    );
    // json and urlencoded are middleware factories. They must be invoked here;
    // passing the factory itself causes every request to stop before its route.
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get("/status", (req, res) => {
      res.status(200).json({ message: "Server Is Up And Running" });
    });
  } catch (error: any) {
    logger.error("Error Occurred While Executing Express Loader\n", error);
    throw error;
  }
};
export default expressLoader;
