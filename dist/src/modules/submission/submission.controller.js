import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../../common/constants/code.constants.js";
import logger from "../../utils/logger.js";
/**
 * Creates HTTP handlers for submission operations.
 *
 * @param submissionService - Submission business operations used by the handlers.
 * @returns Express handlers for creating and retrieving submissions.
 */
export default function (submissionService) {
  return {
    /**
     * Creates a submission for the authenticated user.
     *
     * @param req - Request containing the validated payload and authenticated user.
     * @param res - Response used to confirm the submission.
     * @returns A promise that resolves after the response is sent.
     * @throws Rethrows service or persistence errors for the error middleware.
     */
    create: async (req, res) => {
      logger.info("Starting Execution Of The create Submission controller");
      try {
        const reqBody = req.body;
        const id = req.user?.id;
        await submissionService.create(reqBody, id);
        res.sendResponse({
          success: RESPONSE_STATUS.SUCCESS,
          messageCode: "SOLUTION_SUBMITTED_SUCCESSFULLY",
          statusCode: HTTP_CODE.OK,
        });
      } catch (err) {
        logger.error(
          "Error Occurred While Executing create Submission Controller",
        );
        throw err;
      }
    },
    /**
     * Fetches the authenticated user's submissions for a problem.
     *
     * @param req - Request containing pagination, problem ID, and authenticated user data.
     * @param res - Response used to send the paginated submissions.
     * @returns A promise that resolves after the response is sent.
     * @throws Rethrows service or persistence errors for the error middleware.
     */
    getAll: async (req, res) => {
      logger.info("Starting Execution Of The getAll Submission controller");
      try {
        const query = req.query;
        const id = req.user?.id;
        const submissions = await submissionService.getAll(query, id);
        if (!submissions?.result?.length) {
          res.sendResponse({
            success: RESPONSE_STATUS.SUCCESS,
            statusCode: HTTP_CODE.OK,
            data: submissions,
            messageCode: "NO_SUBMISSIONS_FOUND",
          });
        }
        res.sendResponse({
          success: RESPONSE_STATUS.SUCCESS,
          messageCode: "FIELDS_FETCHED_SUCCESSFULLY",
          statusCode: HTTP_CODE.OK,
          data: submissions,
          replaceMsgObj: { field1: "Submission" },
        });
      } catch (err) {
        logger.error(
          "Error Occurred While Executing getAll Submission Controller",
        );
        throw err;
      }
    },
    /**
     * Fetches details for one submission owned by the authenticated user.
     *
     * @param req - Request containing the submission ID and authenticated user data.
     * @param res - Response used to send the submission details.
     * @returns A promise that resolves after the response is sent.
     * @throws Rethrows service or persistence errors for the error middleware.
     */
    getDetails: async (req, res) => {
      logger.info("Starting Execution Of The getDetails Submission controller");
      try {
        const { submissionId } = req.params;
        const id = req.user?.id;
        const submission = await submissionService.getDetails(submissionId, id);
        res.sendResponse({
          success: RESPONSE_STATUS.SUCCESS,
          messageCode: "FIELDS_FETCHED_SUCCESSFULLY",
          statusCode: HTTP_CODE.OK,
          data: submission,
          replaceMsgObj: { field1: "Submission Details" },
        });
      } catch (err) {
        logger.error(
          "Error Occurred While Executing getDetails Submission Controller",
        );
        throw err;
      }
    },
  };
}
