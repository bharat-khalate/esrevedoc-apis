import { performModelQuery } from "../../common/db.helper.js";
import logger from "../../utils/logger.js";
import { IGetAllProblemsRepoParams } from "./problem.types.js";

/**
 * Fetches a filtered, paginated list of problems from the database.
 *
 * The query selects the problem summary fields, the total submission count,
 * and—when a user id is provided—the latest submission made by that user.
 *
 * @param query - Pagination, ordering, filtering, and optional user context.
 * @returns The paginated problem results and their count metadata.
 * @throws Rethrows database or query execution errors.
 */
export const getAllProblems = async (query: IGetAllProblemsRepoParams) => {
  logger.info("Started Execution Of The getAllProblems Problems Repository");
  try {
    const { id, limit, ...restQuery } = query;
    return await performModelQuery({
      model: "Problem",
      operation: "read",
      limit: Number(limit),
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        _count: {
          select: {
            submissions: true,
          },
        },
        ...(id
          ? {
              submissions: {
                where: {
                  submittedBy: Number(id),
                },
                limit: 1,
                orderBy: { createdAt: "desc" },
              },
            }
          : {}),
      },
      ...restQuery,
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The getAllProblems Problems Repository",
      err,
    );
    throw err;
  }
};

/**
 * Fetches Problem with title, description, examples and recent submission if user id is not undefined.
 *
 * @param problemId - id of problem whose details needs to be fetched.
 * @param userId - id of user to fetch submissions.
 * @returns Problems with details, examples and examples.
 * @throws Rethrows database or query execution errors.
 */
export const getProblemDetails = async (problemId: number, userId?: number) => {
  logger.info("Started Execution Of The getProblemDetails Problems Repository");
  try {
    return await performModelQuery({
      model: "Problem",
      operation: "findOne",
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        examples: true,
        ...(userId
          ? {
              submissions: {
                where: {
                  submittedBy: Number(userId),
                },
                limit: 1,
                orderBy: { createdAt: "desc" },
              },
            }
          : {}),
      },
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The getProblemDetails Problems Repository",
      err,
    );
    throw err;
  }
};
