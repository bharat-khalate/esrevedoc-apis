import {
  isValidEnumValue,
  isValidNumber,
  isValidPagination,
  requiredFieldValidation,
} from "../../common/validation.js";
import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../../common/constants/code.constants.js";
import { SUBMISSION_RESULT } from "../../common/constants/enum.constants.js";
/**
 * Validates the payload for creating a submission.
 *
 * Sends a bad-request response when required fields, numeric values, or the
 * submission result are invalid. Otherwise, it passes control to the next
 * middleware.
 *
 * @param req - The Express request containing the submission payload.
 * @param res - The Express response used for validation errors.
 * @param next - The middleware callback invoked after successful validation.
 * @returns The validation response when invalid, otherwise the result of calling next.
 */
export const validateCreateRequest = (req, res, next) => {
  const requiredFields = ["code", "tcPassed", "result", "problemId", "totalTc"];
  const reqBody = req.body;
  const missingField = requiredFieldValidation({ requiredFields, reqBody });
  if (!missingField?.length) {
    return res.sendResponse({
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      statusCode: HTTP_CODE.BAD_REQUEST,
      replaceMsgObj: { field1: missingField.join(",") },
    });
  }
  const { tcPassed, result, problemId, totalTc } = reqBody;
  if (!isValidNumber(tcPassed)) {
    return res.sendResponse({
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      statusCode: HTTP_CODE.BAD_REQUEST,
      replaceMsgObj: { field1: "tcPassed" },
    });
  }
  if (!problemId(tcPassed)) {
    return res.sendResponse({
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      statusCode: HTTP_CODE.BAD_REQUEST,
      replaceMsgObj: { field1: "problemId" },
    });
  }
  if (!problemId(totalTc)) {
    return res.sendResponse({
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      statusCode: HTTP_CODE.BAD_REQUEST,
      replaceMsgObj: { field1: "totalTc" },
    });
  }
  if (!isValidEnumValue(SUBMISSION_RESULT, result)) {
    return res.sendResponse({
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      statusCode: HTTP_CODE.BAD_REQUEST,
      replaceMsgObj: { field1: "result" },
    });
  }
  next();
};
/**
 * Validates pagination and problem ID query parameters for listing submissions.
 *
 * Sends a bad-request response when required fields, numeric values, or the
 * query parameters are invalid; otherwise it passes control to the next
 * middleware.
 *
 * @param req - The Express request containing pagination and problem ID query parameters.
 * @param res - The Express response used for validation errors.
 * @param next - The middleware callback invoked after successful validation.
 * @returns The validation response when invalid, otherwise the result of calling next.
 */
export const validateGetAllRequest = (req, res, next) => {
  const query = req.query;
  if (!isValidPagination(query)) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_PAGE_OR_LIMIT",
    });
  }
  if (isValidNumber(query.problemId)) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      replaceMsgObj: { field1: "problemId" },
    });
  }
  next();
};
/**
 * Validates the submission ID path parameter for fetching submission details.
 *
 * Sends a bad-request response when submissionId is invalid; otherwise it
 * passes control to the next middleware.
 *
 * @param req - The Express request containing the submissionId path parameter.
 * @param res - The Express response used for validation errors.
 * @param next - The middleware callback invoked after successful validation.
 * @returns The validation response when invalid, otherwise the result of calling next.
 */
export const validateGetDetailsRequest = (req, res, next) => {
  const { submissionId } = req.params;
  if (!isValidNumber(submissionId)) {
    res.sendResponse({
      statusCode: HTTP_CODE.BAD_REQUEST,
      success: RESPONSE_STATUS.INVALID_DATA,
      messageCode: "INVALID_FIELD_VALUE",
      replaceMsgObj: { field1: "submissionId" },
    });
  }
  next();
};
