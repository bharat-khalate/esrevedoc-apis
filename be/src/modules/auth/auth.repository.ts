import { UserCreateInput } from "../../../prisma/generated/prisma/models.js";
import { getDb } from "../../common/db.helper.js";
import logger from "../../utils/logger.js";

/**
 * Persists a new user record.
 *
 * @param userData - The data used to create the user.
 * @returns The newly created user.
 * @throws Rethrows errors returned by Prisma.
 */
export const createUser = async (userData: UserCreateInput) => {
  logger.info("Starting Execution of the createUser User Repository");
  try {
    const db = getDb();
    return await db.user.create({ data: userData });
  } catch (err) {
    logger.error("Error While Executing creteUser User Repository", err);
    throw err;
  }
};

/**
 * Finds users matching any of the supplied field-value conditions.
 *
 * @param options - The conditions combined with an `OR` query.
 * @returns All users matching at least one condition.
 * @throws Rethrows errors returned by Prisma.
 */
export const getUsersByOptions = async (options: Record<string, string>[]) => {
  logger.info("Starting Execution of the getUsersByOptions User Repository");
  try {
    const db = getDb();
    return await db.user.findMany({ where: { OR: options } });
  } catch (err) {
    logger.error(
      "Error While Executing getUsersByOptions User Repository",
      err,
    );
    throw err;
  }
};
