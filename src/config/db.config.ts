import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "../../prisma/generated/prisma/client.js";
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
            args.data.passwordHash as string,
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
  } catch (error: any) {
    logger.error("Error Occurred While Connecting Database", error);
    throw error;
  }
};

export const closeDb = async () => {
  logger.info("Closing Database Connection");

  try {
    await prisma.$disconnect();
    logger.info("Database Connection Closed Successfully");
  } catch (error: any) {
    logger.error("Error Occurred While Closing Database", error);
    throw error;
  }
};
export default prisma;
export type TPrismaTransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];
export type TPrismaModels = Prisma.TypeMap["model"];
export type TModelName = keyof TPrismaModels;
export type TModelDelegate<T extends TModelName> =
  PrismaClient[Uncapitalize<T>];
export type TWhereInput<T extends TModelName> =
  TPrismaModels[T]["operations"]["findFirst"]["args"]["where"];
export type TModelDelegateName = Uncapitalize<TModelName>;
export type TValidFieldsForModel<T extends TModelName> =
  TPrismaModels[T]["operations"]["findMany"]["args"]["select"] extends infer SelectType
    ? SelectType extends object
      ? (keyof SelectType)[]
      : string[]
    : string[];
export type TScalarFields<T extends TModelName> =
  TPrismaModels[T]["operations"]["update"]["args"]["data"] extends infer UpdateData
    ? UpdateData extends object
      ? keyof UpdateData
      : never
    : never;
export type TSelectableFields<T extends TModelName> =
  TPrismaModels[T]["operations"]["findFirst"]["args"]["select"] extends infer SelectType
    ? SelectType extends object
      ? keyof SelectType
      : never
    : never;
export type TIncludableFields<T extends TModelName> = string | number | symbol;
export type OrderByType<T extends TModelName> =
  TPrismaModels[T]["operations"]["findMany"]["args"]["orderBy"];
export type TUpdateDataType<T extends TModelName> =
  TPrismaModels[T]["operations"]["update"]["args"]["data"];
export type TCreateDataType<T extends TModelName> =
  TPrismaModels[T]["operations"]["create"]["args"]["data"];
export type SelectType<T extends TModelName> =
  TPrismaModels[T]["operations"]["findFirst"]["args"]["select"];
export type TIncludeType<T extends TModelName> =
  TPrismaModels[T]["operations"]["findFirst"]["args"] extends infer Args
    ? Args extends { include?: infer Include }
      ? Include
      : never
    : never;
