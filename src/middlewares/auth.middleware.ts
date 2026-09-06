import { NextFunction, Request, Response } from "express";
import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../common/constants/code.constants.js";
import { TOKEN_TYPE } from "../common/constants/enum.constants.js";
import {
  BASIC_AUTH_PASSWORD,
  BASIC_AUTH_USERNAME,
} from "../common/constants/env.js";
import { performModelQuery } from "../common/db.helper.js";
import { validateToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

export const basicAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info("Starting Execution Of Basic Auth Middleware");
  try {
    // Node normalizes request header names to lowercase. The authentication
    // scheme is also case-sensitive in this check, so use the standard value.
    const authHeaders = req.headers.authorization;
    if (!authHeaders?.startsWith("Basic ")) {
      return res.sendResponse({
        statusCode: HTTP_CODE.UNAUTHORIZED,
        success: RESPONSE_STATUS.AUTH_FAIL,
        messageCode: "AUTH_FAILED",
      });
    }
    const encodedCredentials = authHeaders?.split(" ")[1];
    if (!encodedCredentials) {
      return res.sendResponse({
        statusCode: HTTP_CODE.UNAUTHORIZED,
        success: RESPONSE_STATUS.AUTH_FAIL,
        messageCode: "AUTH_FAILED",
      });
    }
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64",
    ).toString();
    const [userName, password] = decodedCredentials.split(":");
    if (userName === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
      return next();
    } else {
      return res.sendResponse({
        statusCode: HTTP_CODE.UNAUTHORIZED,
        success: RESPONSE_STATUS.AUTH_FAIL,
        messageCode: "AUTH_FAILED",
      });
    }
  } catch (err) {
    console.error(
      "Error Occurred While Executing The basic basicAuthMiddleware",
      err,
    );
    return res.sendResponse({
      statusCode: HTTP_CODE.SERVER_ERROR,
      success: RESPONSE_STATUS.ERROR,
      messageCode: "SOMETHING_WENT_WRONG",
    });
  }
};

export const authMiddleware =
  (strict = true) =>
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Started Execution Of Auth Middleware");
    try {
      const encodedToken = req.header("accessToken");
      if (!encodedToken && strict) {
        return res.sendResponse({
          success: RESPONSE_STATUS.AUTH_FAIL,
          messageCode: "AUTH_TOKEN_REQUIRED",
          statusCode: HTTP_CODE.UNAUTHORIZED,
        });
      }
      if (!encodedToken && !strict) {
        return next();
      }
      if (!encodedToken?.startsWith("Bearer ") && strict) {
        return res.sendResponse({
          success: RESPONSE_STATUS.AUTH_FAIL,
          messageCode: "INVALID_ACCESS_TOKEN",
          statusCode: HTTP_CODE.UNAUTHORIZED,
        });
      }
      if (!encodedToken?.startsWith("Bearer ") && !strict) {
        return next();
      }

      try {
        if (!encodedToken) {
          return res.sendResponse({
            success: RESPONSE_STATUS.AUTH_FAIL,
            messageCode: "AUTH_TOKEN_REQUIRED",
            statusCode: HTTP_CODE.UNAUTHORIZED,
          });
        }
        const decodedPayload = validateToken(encodedToken);
        if (decodedPayload.token_type !== TOKEN_TYPE.ACCESS_TOKEN) {
          return res.sendResponse({
            success: RESPONSE_STATUS.AUTH_FAIL,
            messageCode: "INVALID_ACCESS_TOKEN",
            statusCode: HTTP_CODE.UNAUTHORIZED,
          });
        }
        const user = await performModelQuery({
          model: "User",
          operation: "findOne",
          where: { id: decodedPayload.id },
        });
        if (!user) {
          return res.sendResponse({
            success: RESPONSE_STATUS.AUTH_FAIL,
            statusCode: HTTP_CODE.UNAUTHORIZED,
            messageCode: "INVALID_ACCESS_TOKEN",
          });
        }
        req.user = user;
        req.step = decodedPayload.nextStep;
        return next();
      } catch (err) {
        return res.sendResponse({
          success: RESPONSE_STATUS.AUTH_FAIL,
          statusCode: HTTP_CODE.UNAUTHORIZED,
          messageCode: "INVALID_ACCESS_TOKEN",
        });
      }
    } catch (err) {
      logger.error("Error In Auth Middleware", err);
      return res.sendResponse({
        statusCode: HTTP_CODE.SERVER_ERROR,
        messageCode: "SOMETHING_WENT_WRONG",
        success: RESPONSE_STATUS.ERROR,
      });
    }
  };
