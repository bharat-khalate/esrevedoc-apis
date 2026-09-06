import { SUBMISSION_RESULT } from "../../../prisma/generated/prisma/enums.js";
import { SubmissionUncheckedCreateInput } from "../../../prisma/generated/prisma/models.js";
import { ICommonListingRepoParam } from "../../types/common.types.js";
import createSubmissionService from "./submission.service.js";
export type TSubmissionRepository = typeof import("./submission.repository.js");
export type TSubmissionService = ReturnType<typeof createSubmissionService>;

/** Values supported as the result of a submitted solution. */
export type TSubmissionResult =
  (typeof SUBMISSION_RESULT)[keyof typeof SUBMISSION_RESULT];

/** Validated request data required to create a submission. */
export interface ICreateServiceParam {
  code: string;
  result: TSubmissionResult;
  tcPassed: number;
  note?: string[];
  problemId: number;
  totalTc: number;
}

/** Database payload used to create a submission record. */
export type TCreateSubmissionPayload = SubmissionUncheckedCreateInput;

/** Pagination and filtering options passed to the submission repository. */
export interface IGetAllRepoParam {
  where: Record<string, any>;
  page: number;
  limit: number;
  order: Record<string, string>;
}

/** Query parameters accepted when listing a user's submissions. */
export interface IGetAllServiceParam extends ICommonListingRepoParam {
  problemId: number;
}
