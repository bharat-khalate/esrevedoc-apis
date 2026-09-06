import { User } from "../../prisma/generated/prisma/client.js";
import { TOKEN_TYPE } from "../common/constants/enum.constants.js";

declare global {
  namespace Express {
    interface Response {
      sendResponse: (params: IResponseHandlerParams) => Response;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      step?: string;
    }
  }
}

export interface ITranslations {
  [key: string]: string | ITranslations;
}

export interface IResponseHandlerParams {
  statusCode: number;
  messageCode: string;
  data?: Record<string, any>;
  success: number;
  replaceMsgObj?: Record<string, string>;
}

type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

export interface ITokenPayload {
  id: number;
  name: string;
  userName: string;
  mobileNumber: string;
  nextStep: "DASHBOARD" | "VERIFY_EMAIL" | "VERIFY_MOBILE_NUMBER";
  token_type: TokenType;
}

export interface IRoleDataResponse {
  id: number;
  roleName: string[];
  access: string[];
}

export interface IPaginatedResponse<T> {
  result: T[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  remainingCount: number;
  roleData?: IRoleDataResponse;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  isSearch?: boolean;
  order?: any;
}

export type TSearchValue =
  string | number | boolean | string[] | number[] | boolean[];

export type TSearchConfig = {
  field: string;
  type: "regex" | "equal" | "objectField" | "range" | "date" | "notNullBoolean";
  dataType?: "String" | "Number" | "Boolean" | "range";
  format?: string;
  allowMulti?: boolean;
};

export type TSearchFields = Record<string, TSearchConfig | TSearchConfig[]>;

export interface ICommonListingRepoParam {
  limit: number;
  page: number;
  where: Record<string, unknown>;
  order: Record<string, string> | Record<string, string>[];
}
