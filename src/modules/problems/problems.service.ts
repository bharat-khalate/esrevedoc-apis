import { fetchUserRoleData } from "../../common/db.helper.js";
import {
  getSearchFilterPrismaCondition,
  normalizeSearchFields,
} from "../../common/helper.js";
import { IPaginatedResponse, TSearchFields } from "../../types/common.types.js";
import {
  IGetAllProblemsQuery,
  IProblems,
  TProblemsRepository,
} from "./problem.types.js";

/**
 * Creates Problems business operations backed by a problems repository.
 *
 * @param problemsRepository - The data-access operations used by Problems Service.
 * @returns Service methods for performing problems operations.
 */
const createProblemsService = (problemsRepository: TProblemsRepository) => {
  return {
    /**
     * Handles Filters and pagination and returns paginated problems.
     *
     * @param query - Pagination and filters options.
     * @returns The list of problems with submission count.
     * @throws Rethrows repository and operation errors.
     */
    getAllProblems: async (
      query: IGetAllProblemsQuery,
      id: number | undefined,
    ): Promise<IPaginatedResponse<IProblems>> => {
      let {
        page = 1,
        limit = 1,
        search1 = "",
        search2 = "",
        isSearch = false,
      } = query;
      search1 = normalizeSearchFields(search1);
      search2 = normalizeSearchFields(search2);
      const searchFields: TSearchFields = {
        search1: [
          {
            type: "regex",
            field: "title",
          },
          {
            type: "regex",
            field: "description",
          },
        ],
        search2: { type: "equal", dataType: "String", field: "topic" },
      };
      const searchDataFilter = getSearchFilterPrismaCondition(searchFields, {
        search1,
        search2,
      });
      page = isSearch ? 1 : page;
      const defaultOrder = { createdAt: "asc" };
      const order =
        typeof query.order === "object" ? query.order : defaultOrder;
      const paginatedProblems = await problemsRepository.getAllProblems({
        page,
        limit,
        order,
        where: searchDataFilter,
        id,
      });
      const roleData = id ? await fetchUserRoleData(id) : null;
      return {
        result: paginatedProblems.result.map((problem) => ({
          id: problem.id,
          title: problem.title,
          description: problem.description,
          level: problem.level,
          solutionsSubmitted: problem._count.submissions,
        })),
        totalPages: paginatedProblems.totalPages,
        currentPage: paginatedProblems.currentPage,
        totalCount: paginatedProblems.totalCount,
        remainingCount: paginatedProblems.remainingCount,
        ...(roleData ? { roleData } : {}),
      };
    },
    /**
     *returns problems details options.
     *
     * @param {number} problemId - Id of problem for which we are fetching details.
     * @returns The details of problems with submission count.
     * @throws Rethrows repository and operation errors.
     */
    getProblemDetails: async (problemId: number, id: number | undefined) => {
      const problemDetails = await problemsRepository.getProblemDetails(
        problemId,
        id,
      );
      const submission = problemDetails?.submissions?.length
        ? problemDetails?.submissions[0]
        : null;
      const formattedResponse = {
        problem_id: problemDetails?.id,
        title: problemDetails?.title,
        description: problemDetails?.description,
        level: problemDetails?.level,
        examples: problemDetails?.examples?.map(
          ({ input, output, explanation }, idx) => ({
            input,
            output,
            explanation,
          }),
        ),
        submission: submission
          ? {
              code: submission.code,
              result: submission?.result,
              tsPassed: submission?.tcPassed,
              createdAt: submission?.createdAt,
            }
          : null,
      };
      return formattedResponse;
    },
  };
};

export default createProblemsService;
