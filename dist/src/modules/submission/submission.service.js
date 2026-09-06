import { ApiError } from "../../utils/error.js";
import { HTTP_CODE } from "../../common/constants/code.constants.js";
/**
 * Creates submission business operations backed by a submission repository.
 *
 * @param submissionRepository - Data-access operations used by the service.
 * @returns Methods for creating and retrieving submissions.
 */
export default function (submissionRepository) {
  return {
    /**
     * Maps the validated request to a persistence payload and saves it.
     *
     * @param reqBody - The validated submission request payload.
     * @param userId - The ID of the authenticated user submitting the solution.
     * @returns The newly created submission record.
     * @throws Rethrows repository or database errors.
     */
    create: async (reqBody, userId) => {
      const submission = {
        problemId: reqBody.problemId,
        code: reqBody.code,
        result: reqBody.result,
        tcPassed: reqBody.tcPassed,
        submittedBy: userId,
        totalTc: reqBody.totalTc,
      };
      return await submissionRepository.createSubmission(submission);
    },
    /**
     * Fetches a paginated list of the user's submissions for a problem.
     *
     * @param query - The validated pagination params with problemId.
     * @param userId - The ID of the authenticated user fetching submission of the problem.
     * @returns Paginated submissions ordered from newest to oldest.
     * @throws Rethrows repository or database errors.
     */
    getAll: async (query, userId) => {
      let { page = 1, limit = 10 } = query;
      const order = { createdAt: "desc" };
      const where = { submittedBy: userId, problemId: query.problemId };
      const submissionList = await submissionRepository.getAll({
        page,
        limit,
        order,
        where,
      });
      const result = submissionList.result?.map(
        ({ id, result, tcPassed, totalTc }) => ({
          id,
          result,
          tcPassed,
          totalTc,
        }),
      );
      return { ...submissionList, result };
    },
    /**
     * Fetches one submission and its notes, restricted to the requesting user.
     *
     * @param submissionId - The primary id of the submission.
     * @param userId - The ID of the authenticated user fetching submission details.
     * @returns The formatted submission details with notes.
     * @throws ApiError When the submission does not exist for the user.
     * @throws Rethrows repository or database errors.
     */
    getDetails: async (submissionId, userId) => {
      const submission = await submissionRepository.getDetails(
        submissionId,
        userId,
      );
      if (!submission) {
        throw new ApiError({
          statusCode: HTTP_CODE.BAD_REQUEST,
          messageCode: "NO_SUBMISSION_FOUND",
          success: HTTP_CODE.ERROR,
        });
      }
      return {
        id: submission?.id,
        code: submission?.code,
        result: submission?.result,
        tcPassed: submission?.tcPassed,
        totalTc: submission?.totalTc,
        notes: submission?.notes,
        createdAt: submission?.createdAt,
      };
    },
  };
}
