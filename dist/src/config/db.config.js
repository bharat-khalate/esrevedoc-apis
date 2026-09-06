import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { PrismaClient } from "../../prisma/generated/prisma/client.js";
import { DATABASE_URL } from "../common/constants/env.js";
import logger from "../utils/logger.js";
const connectionString = DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      async create({ args, query }) {
        if (args.data.passwordHash) {
          args.data.passwordHash = await bcrypt.hash(
            args.data.passwordHash,
            10,
          );
        }
        return query(args);
      },
      async update({ args, query }) {
        if (args.data.passwordHash) {
          args.data.passwordHash = await bcrypt.hash(
            args.data.passwordHash,
            10,
          );
        }
        return query(args);
      },
    },
  },
});
export const connectDb = async () => {
  logger.info("Connecting To Database");
  try {
    await prisma.$connect();
    logger.info("Connected To Data Base Successfully ");
  } catch (error) {
    logger.error("Error Occurred While Connecting Database", error);
    throw error;
  }
};
export const closeDb = async () => {
  logger.info("Closing Database Connection");
  try {
    await prisma.$disconnect();
    logger.info("Database Connection Closed Successfully");
  } catch (error) {
    logger.error("Error Occurred While Closing Database", error);
    throw error;
  }
};
export default prisma;
