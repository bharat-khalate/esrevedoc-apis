import {
  PROBLEM_LEVEL as PRISMA_PROBLEM_LEVEL,
  SUBMISSION_RESULT as PRISMA_SUBMISSION_RESULT,
  USER_STATUS as PRISMA_USER_STATUS,
  USER_ROLE_STATUS as PRISMA_USER_ROLE_STATUS,
} from "../../../prisma/generated/prisma/enums.js";
import { toLowerCaseEnum } from "../helper.js";
export const PROBLEM_LEVEL = toLowerCaseEnum(PRISMA_PROBLEM_LEVEL);
export const SUBMISSION_RESULT = toLowerCaseEnum(PRISMA_SUBMISSION_RESULT);
export const USER_STATUS = toLowerCaseEnum(PRISMA_USER_STATUS);
export const USER_ROLE_STATUS = toLowerCaseEnum(PRISMA_USER_ROLE_STATUS);
export const TOKEN_TYPE = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};
