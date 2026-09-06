import { AsyncLocalStorage } from "node:async_hooks";
import prisma, {
  OrderByType,
  SelectType,
  TCreateDataType,
  TIncludeType,
  TModelName,
  TPrismaTransactionClient,
  TScalarFields,
  TModelDelegate,
  TUpdateDataType,
  TValidFieldsForModel,
  TWhereInput,
} from "../config/db.config.js";
import logger from "../utils/logger.js";
import { Prisma } from "../../prisma/generated/prisma/client.js";
import { USER_ROLE_STATUS as PRISMA_USER_ROLE_STATUS } from "../../prisma/generated/prisma/enums.js";
import { IRoleDataResponse } from "../types/common.types.js";

const transactionContext = new AsyncLocalStorage<TPrismaTransactionClient>();

export const getDb = () => transactionContext.getStore() ?? prisma;

export const runInTransaction = async <T>(
  callback: () => Promise<T>,
): Promise<T> => {
  const existingTransaction = transactionContext.getStore();
  if (existingTransaction) {
    return callback();
  }
  return prisma.$transaction(async (tx) => {
    return transactionContext.run(tx, callback);
  });
};

export const transactionalService = <TArgs extends unknown[], TResult>(
  service: (...args: TArgs) => Promise<TResult>,
) => {
  return (...args: TArgs): Promise<TResult> => {
    return runInTransaction(() => service(...args));
  };
};

const getModelName = <T extends TModelName>(model: T): Uncapitalize<T> => {
  return (model.charAt(0).toLowerCase() +
    model.substring(1)) as Uncapitalize<T>;
};

export interface ICheckRecordExistParams<T extends TModelName> {
  model: T;
  id?: number;
  where?: TWhereInput<T>;
}
export const checkRecordExist = async <T extends TModelName>({
  model,
  id,
  where,
}: ICheckRecordExistParams<T>) => {
  logger.info("Started Execution Of checkRecordExist DB Helper");

  try {
    const modelName = getModelName(model);
    const db = getDb();
    const finalConditions = {
      ...(id !== undefined ? { id } : {}),
      ...where,
    };
    return await (db[modelName] as any).findFirst({
      where: finalConditions,
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing checkRecordExist DB helper",
      err,
    );

    throw err;
  }
};

export interface IFetchRecordsWithFieldsParams<T extends TModelName> {
  model: T;
  operation: "findMany" | "findFirst";
  fields: TValidFieldsForModel<T>;
  where?: TWhereInput<T>;
}
export const fetchRecordsWithFields = async <T extends TModelName>({
  model,
  operation,
  fields,
  where,
}: IFetchRecordsWithFieldsParams<T>) => {
  logger.info("Started Execution Of fetchRecordsWithFields DB Helper");

  try {
    const modelName = getModelName(model);
    const db = getDb();
    const selectObject = fields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    const queryOptions = {
      select: selectObject,
      ...(where && { where }),
    };
    if (operation === "findMany") {
      return await (db[modelName] as any).findMany(queryOptions);
    } else if (operation === "findFirst") {
      return await (db[modelName] as any).findFirst({ ...queryOptions });
    } else {
      throw new Error(`Invalid operation: ${operation}`);
    }
  } catch (err) {
    logger.error(
      "Error Occurred While Executing fetchRecordsWithFields DB helper",
      err,
    );
    throw err;
  }
};

export interface IPerformModelQueryParams<
  T extends TModelName,
  Op extends
    | "create"
    | "insertMany"
    | "findOne"
    | "read"
    | "readAll"
    | "readAllWithoutCount"
    | "update"
    | "updateStatus"
    | "delete"
    | "softDelete"
    | "count" =
    | "create"
    | "insertMany"
    | "findOne"
    | "read"
    | "readAll"
    | "readAllWithoutCount"
    | "update"
    | "updateStatus"
    | "delete"
    | "softDelete"
    | "count",
> {
  model: T;
  operation: Op;
  data?: Op extends "create"
    ? TCreateDataType<T>
    : Op extends "insertMany"
      ? Prisma.Args<TModelDelegate<T>, "createMany">["data"]
      : never;
  where?: TWhereInput<T>;
  update?: Op extends "update" | "updateStatus"
    ? Partial<TUpdateDataType<T>>
    : never;
  page?: Op extends "read" ? number : never;
  limit?: Op extends "read" | "readAllWithoutCount" | "readAll"
    ? number
    : never;
  orderBy?: OrderByType<T>;
  select?: SelectType<T>;
  include?: TIncludeType<T>;
  status?: Op extends "updateStatus" ? TScalarFields<T> : never;
  updatedBy?: Op extends "updateStatus" ? number | string : never;
  groupBy?: Op extends "read" | "readAll" | "readAllWithoutCount"
    ? string[]
    : never;
}

type TPerformModelQueryResult<
  T extends TModelName,
  Op extends IPerformModelQueryParams<T>["operation"],
  S extends SelectType<T> | undefined,
  I extends TIncludeType<T> | undefined,
> = Op extends "create"
  ? Prisma.Result<TModelDelegate<T>, { select: S; include: I }, "create">
  : Op extends "insertMany"
    ? Prisma.Result<TModelDelegate<T>, {}, "createMany">
    : Op extends "findOne"
      ? Prisma.Result<TModelDelegate<T>, { select: S; include: I }, "findFirst">
      : Op extends "read" | "readAll" | "readAllWithoutCount"
        ? Op extends "read"
          ? {
              result: Prisma.Result<
                TModelDelegate<T>,
                { select: S; include: I },
                "findMany"
              >;
              totalPages: number;
              currentPage: number;
              totalCount: number;
              remainingCount: number;
            }
          : Op extends "readAllWithoutCount"
            ? {
                result: Prisma.Result<
                  TModelDelegate<T>,
                  { select: S; include: I },
                  "findMany"
                >;
                fetchedCount: number;
              }
            : {
                result: Prisma.Result<
                  TModelDelegate<T>,
                  { select: S; include: I },
                  "findMany"
                >;
                total_count: number;
              }
        : Op extends "count"
          ? Prisma.Result<TModelDelegate<T>, {}, "count">
          : Op extends "delete"
            ? Prisma.Result<TModelDelegate<T>, {}, "deleteMany">
            : Prisma.Result<TModelDelegate<T>, {}, "updateMany">;

/**
 * Transaction Support: ✅ FULLY SUPPORTED
 * All operations automatically use transaction if inside runInTransaction()
 * Example: await runInTransaction(() => performModelQuery({ ... }))
 *
 * Group By: ✅ SUPPORTED
 * Use groupBy parameter with read operations
 * Example: { operation: 'read', groupBy: ['status', 'category'] }
 *
 * Locking: ⚠️ PARTIAL
 * Prisma doesn't support explicit row locks like SELECT FOR UPDATE
 * Alternatives:
 * - Use transactions for optimistic locking
 * - Implement version columns for optimistic concurrency control
 * - Use database-level constraints
 */

/**
 * Common Query handler for Prisma CRUD operations
 * Abstraction layer for easy migration between ORMs
 * @param {string} model - Name of model
 * @param {string} operation - Operation to perform
 * @param {object} params - Operation parameters
 * @returns {Promise<any>} - Returns result depending on the operation
 */
export const performModelQuery = async <
  T extends TModelName,
  Op extends
    | "create"
    | "insertMany"
    | "findOne"
    | "read"
    | "readAll"
    | "readAllWithoutCount"
    | "update"
    | "updateStatus"
    | "delete"
    | "softDelete"
    | "count" =
    | "create"
    | "insertMany"
    | "findOne"
    | "read"
    | "readAll"
    | "readAllWithoutCount"
    | "update"
    | "updateStatus"
    | "delete"
    | "softDelete"
    | "count",
  S extends SelectType<T> | undefined = undefined,
  I extends TIncludeType<T> | undefined = undefined,
>({
  model,
  operation,
  data,
  where,
  update,
  page,
  limit,
  orderBy,
  select,
  include,
  status,
  updatedBy,
  groupBy,
}: IPerformModelQueryParams<T, Op> & {
  select?: S;
  include?: I;
}): Promise<TPerformModelQueryResult<T, Op, S, I>> => {
  const finalWhere = where ?? {};
  const finalPage = page ?? 1;
  const finalLimit = limit ?? 10;
  logger.info(
    `Started Execution Of performModelQuery - Operation: ${operation}, Model: ${model}`,
  );

  try {
    const modelName = getModelName(model);
    const db = getDb();

    const operationHandlers = {
      create: async () => {
        logger.info(`Executing create operation on ${model}`);
        return await (db[modelName] as any).create({
          data,
        });
      },

      insertMany: async () => {
        if (!Array.isArray(data)) {
          throw new Error("insertMany requires data to be an array");
        }
        logger.info(`Executing insertMany operation on ${model}`);
        return await (db[modelName] as any).createMany({
          data,
        });
      },

      findOne: async () => {
        logger.info(`Executing findOne operation on ${model}`);
        return await (db[modelName] as any).findFirst({
          where: finalWhere,
          select,
          include,
          orderBy,
        });
      },

      read: async () => {
        logger.info(`Executing read operation on ${model} with pagination`);
        const offset = (finalPage - 1) * finalLimit;
        const [result, totalCount] = await Promise.all([
          (db[modelName] as any).findMany({
            where: finalWhere,
            select,
            include,
            orderBy,
            skip: offset,
            take: finalLimit,
            ...(groupBy && { groupBy }),
          }),
          (db[modelName] as any).count({ where: finalWhere }),
        ]);

        const remainingCount = Math.max(0, totalCount - finalLimit * finalPage);
        return {
          result,
          totalPages: Math.ceil(totalCount / finalLimit),
          currentPage: finalPage,
          totalCount,
          remainingCount,
        };
      },

      readAllWithoutCount: async () => {
        logger.info(`Executing readAllWithoutCount operation on ${model}`);
        const result = await (db[modelName] as any).findMany({
          where: finalWhere,
          select,
          include,
          orderBy,
          ...(groupBy && { groupBy }),
        });

        return {
          result,
          fetchedCount: result.length,
        };
      },

      readAll: async () => {
        logger.info(`Executing readAll operation on ${model}`);
        const [result, total_count] = await Promise.all([
          (db[modelName] as any).findMany({
            where: finalWhere,
            select,
            include,
            orderBy,
            ...(groupBy && { groupBy }),
          }),
          (db[modelName] as any).count({ where: finalWhere }),
        ]);

        return {
          result,
          total_count,
        };
      },

      update: async () => {
        if (!update) {
          throw new Error("Missing update data for update operation");
        }
        logger.info(`Executing update operation on ${model}`);
        return await (db[modelName] as any).updateMany({
          where: finalWhere,
          data: update,
        });
      },

      updateStatus: async () => {
        if (status === null || status === undefined) {
          throw new Error("Missing status for updateStatus operation");
        }
        if (updatedBy === null || updatedBy === undefined) {
          throw new Error("Missing updatedBy for updateStatus operation");
        }
        logger.info(`Executing updateStatus operation on ${model}`);
        return await (db[modelName] as any).updateMany({
          where: finalWhere,
          data: {
            status,
            updatedBy,
          },
        });
      },

      delete: async () => {
        logger.info(`Executing delete operation on ${model}`);
        return await (db[modelName] as any).deleteMany({
          where: finalWhere,
        });
      },

      softDelete: async () => {
        logger.info(`Executing softDelete operation on ${model}`);
        return await (db[modelName] as any).updateMany({
          where: finalWhere,
          data: {
            deletedAt: new Date(),
          },
        });
      },

      count: async () => {
        logger.info(`Executing count operation on ${model}`);
        return await (db[modelName] as any).count({
          where: finalWhere,
        });
      },
    };

    if (!operationHandlers[operation as keyof typeof operationHandlers]) {
      throw new Error(`Operation '${operation}' is not supported.`);
    }

    return (await operationHandlers[
      operation as keyof typeof operationHandlers
    ]()) as TPerformModelQueryResult<T, Op, S, I>;
  } catch (err) {
    logger.error(
      `Error Occurred While Executing performModelQuery - Operation: ${operation}, Model: ${model}`,
      err,
    );
    throw err;
  }
};

export const fetchUserRoleData = async (id: number) => {
  logger.info("Started Execution Of The fetchUserRoleData DB Helper");
  try {
    const userWithRoleAndPermissions = await performModelQuery({
      model: "User",
      operation: "findOne",
      where: { id },
      include: {
        role: {
          select: {
            roleName: true,
            userPermission: true,
          },
          where: { status: PRISMA_USER_ROLE_STATUS.ACTIVE },
        },
      },
    });
    if (!userWithRoleAndPermissions) return;
    const roleData: IRoleDataResponse = {
      id: userWithRoleAndPermissions.id,
      access: [],
      roleName: [],
    };
    return userWithRoleAndPermissions?.role.reduce((acc, curr) => {
      acc.roleName.push(curr.roleName);
      acc.access.push(
        ...curr.userPermission.map((permission) => permission.codeName),
      );
      return acc;
    }, roleData);
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The fetchUserRoleData DB helper",
      err,
    );
    throw err;
  }
};
