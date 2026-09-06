import enMessages from "../common/languages/en/index.js";
import { replaceFieldText } from "../common/helper.js";
import { ApiError } from "../utils/error.js";
import logger from "../utils/logger.js";
import { RESPONSE_STATUS } from "../common/constants/code.constants.js";
export default function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const messageCode = isApiError
    ? err.messageCode
    : err.message || "SOMETHING_WENT_WRONG";
  const replaceMsgObj = isApiError ? err.replaceMsgObj : {};
  let finalMessage = enMessages[messageCode] || messageCode;
  if (Object.keys(replaceMsgObj).length > 0) {
    finalMessage = replaceFieldText(finalMessage, replaceMsgObj);
  }
  if (statusCode >= 500) {
    logger.error(
      `Unhandled server error [${statusCode}] on ${req.method} ${req.originalUrl}\n${err.stack || err.message}`,
    );
  } else {
    logger.warn(
      `Client error [${statusCode}] on ${req.method} ${req.originalUrl}: ${finalMessage}`,
    );
  }
  res.status(statusCode).json({
    success: RESPONSE_STATUS.ERROR,
    message:
      statusCode >= 500 && !isApiError
        ? enMessages.SOMETHING_WENT_WRONG || "Something went wrong"
        : finalMessage,
    ...(isApiError && err.data ? { data: err.data } : {}),
  });
}
