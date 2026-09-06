import { performModelQuery } from "../../common/db.helper.js";
import logger from "../../utils/logger.js";
/**
 * Persists a new submission record in the database.
 *
 * @param submission - The submission data to store.
 * @returns The newly created submission record.
 * @throws Rethrows database or query execution errors.
 */
export const createSubmission = async (submission) => {
  logger.info("Starting Execution Of The createSubmission Repository");
  try {
    return await performModelQuery({
      model: "Submission",
      operation: "create",
      data: submission,
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The createSubmission Submission Repository",
    );
    throw err;
  }
};
/**
 * Fetches a paginated list of submissions matching the supplied filters.
 *
 * @param query - Pagination, ordering, and filtering options.
 * @returns Paginated submission records with their note IDs and text.
 * @throws Rethrows database or query execution errors.
 */
export const getAll = async (query) => {
  logger.info("Starting Execution Of The getAll Repository");
  try {
    return await performModelQuery({
      model: "Submission",
      operation: "read",
      ...query,
      include: {
        notes: {
          select: {
            text: true,
            id: true,
          },
        },
      },
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The getAll Submission Repository",
    );
    throw err;
  }
};
/**
 * Fetches one submission belonging to a specific user.
 *
 * @param submissionId - ID of the submission.
 * @param userId - ID of the user requesting the submission details.
 * @returns The submission details with note IDs and text, or null when not found.
 * @throws Rethrows database or query execution errors.
 */
export const getDetails = async (submissionId, userId) => {
  logger.info("Starting Execution Of The getDetails Repository");
  try {
    return await performModelQuery({
      model: "Submission",
      operation: "findOne",
      where: {
        id: submissionId,
        submittedBy: userId,
      },
      include: {
        notes: {
          select: {
            text: true,
            id: true,
          },
        },
      },
    });
  } catch (err) {
    logger.error(
      "Error Occurred While Executing The getDetails Submission Repository",
    );
    throw err;
  }
};
