import { NextFunction, Request, Response } from "express";
import {
  isValidEnumValue,
  isValidMobileNumber,
  isValidNumber,
  isValidPagination,
} from "../../common/validation.js";
import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../../common/constants/code.constants.js";
import { PROBLEM_LEVEL } from "../../common/constants/enum.constants.js";

export const validateGetAllProblemsParams = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = req.query;
  if (!isValidPagination(query)) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      messageCode: "INVALID_PAGE_OR_LIMIT",
      success: RESPONSE_STATUS.INVALID_DATA,
    });
  }
  if (query.search && typeof query.search != "boolean") {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      messageCode: "INVALID_IS_SEARCH",
      success: RESPONSE_STATUS.INVALID_DATA,
    });
  }
  if (
    query.search2 &&
    !isValidEnumValue(PROBLEM_LEVEL, query.search2 as string)
  ) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      messageCode: "INVALID_FIELD_DATA",
      success: RESPONSE_STATUS.INVALID_DATA,
      replaceMsgObj: {
        field1: "search 2",
      },
    });
  }
  next();
};

export const validateGetProblemDetailsParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { problemId } = req.params;
  if (!problemId || isValidNumber(problemId)) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      messageCode: "INVALID_FIELD_DATA",
      success: RESPONSE_STATUS.INVALID_DATA,
      replaceMsgObj: {
        field1: "problem id",
      },
    });
  }
  next();
};
