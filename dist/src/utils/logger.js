import "dotenv/config";
import winston from "winston";
const { combine, timestamp, printf } = winston.format;
const stripAnsi = (str) => {
  if (typeof str !== "string") return str;
  const ansiRegex =
    /[\x1B\x9B][[\]()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=;<>]/g;
  return str.replaceAll(ansiRegex, "");
};
// Reusable formatter for file logs
const fileFormat = combine(
  timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
  printf(
    ({ level, message, timestamp }) =>
      `[${timestamp}] ${level}: ${stripAnsi(String(message))}`,
  ),
);
const createLogger = (logFileName = "app-info.log") => {
  const today = new Date().toISOString().split("T")[0];
  const transports = [
    new winston.transports.File({
      filename: `logs/${today}/${logFileName}`,
      level: "info",
      format: fileFormat,
    }),
  ];
  if (process.env.SENTRY_KEY) {
    const { createRequire } = require("node:module");
    const nodeRequire = createRequire(import.meta.url);
    const SentryTransport = nodeRequire(
      "winston-transport-sentry-node",
    ).default;
    transports.push(
      new SentryTransport({
        sentry: {
          dsn: process.env.SENTRY_KEY,
        },
        level: "error",
        format: winston.format.uncolorize(),
      }),
    );
  }
  if (process.env.NODE_ENV !== "production") {
    transports.push(
      new winston.transports.Console({
        level: "silly",
        format: winston.format.simple(),
      }),
    );
  }
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    transports,
  });
  if (process.env.DISABLE_LOGGING === "YES") {
    logger.transports.forEach((transport) => {
      transport.silent = true;
    });
  }
  return logger;
};
export default createLogger();
export { createLogger };
