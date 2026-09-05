import { PROBLEM_LEVEL } from "../../../prisma/generated/prisma/enums.js";
import {
  ICommonListingRepoParam,
  IPaginationQuery,
} from "../../types/common.types.js";
import createAuthService from "./problems.service.js";
export type TProblemsRepository = typeof import("./problems.repository.js");
export type TProblemsService = ReturnType<typeof createAuthService>;

export interface IProblems {
  id: number;
  title: string;
  description: string;
  level: (typeof PROBLEM_LEVEL)[keyof typeof PROBLEM_LEVEL];
  solutionsSubmitted: number;
}

export interface IGetAllProblemsQuery extends IPaginationQuery {
  search1: string;
  search2: (typeof PROBLEM_LEVEL)[keyof typeof PROBLEM_LEVEL];
}
export interface IGetAllProblemsRepoParams extends ICommonListingRepoParam {
  id: number | undefined;
}
