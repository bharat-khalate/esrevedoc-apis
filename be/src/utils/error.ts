import { RESPONSE_STATUS } from "../common/constants/code.constants.js";

export interface IApiErrorOptions {
  statusCode: number;
  messageCode: string;
  replaceMsgObj?: Record<string, string>;
  data?: Record<string, unknown> | null;
  success: number;
}

export class ApiError extends Error {
  public statusCode: number;
  public messageCode: string;
  public replaceMsgObj: Record<string, string>;
  public data?: Record<string, unknown>;
  public success: number;

  constructor({
    statusCode,
    messageCode,
    replaceMsgObj = {},
    data = null,
    success,
  }: IApiErrorOptions) {
    super(messageCode);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.messageCode = messageCode;
    this.replaceMsgObj = replaceMsgObj;
    this.success = success;

    if (data !== null) {
      this.data = data;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 - Bad Request
 */
export class BadRequestError extends ApiError {
  constructor(
    messageCode = "BAD_REQUEST",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 400,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "BadRequestError";
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(
    messageCode = "UNAUTHORIZED",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 401,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "UnauthorizedError";
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(
    messageCode = "FORBIDDEN",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 403,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "ForbiddenError";
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends ApiError {
  constructor(
    messageCode = "NOT_FOUND",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 404,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "NotFoundError";
  }
}

/**
 * 409 - Conflict
 */
export class ConflictError extends ApiError {
  constructor(
    messageCode = "CONFLICT",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 409,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "ConflictError";
  }
}

/**
 * 422 - Unprocessable Entity
 */
export class ValidationError extends ApiError {
  constructor(
    messageCode = "VALIDATION_ERROR",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 422,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "ValidationError";
  }
}

/**
 * 429 - Too Many Requests
 */
export class TooManyRequestsError extends ApiError {
  constructor(
    messageCode = "TOO_MANY_REQUESTS",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 429,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "TooManyRequestsError";
  }
}

/**
 * 500 - Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(
    messageCode = "INTERNAL_SERVER_ERROR",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 500,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "InternalServerError";
  }
}

/**
 * 502 - Bad Gateway
 */
export class BadGatewayError extends ApiError {
  constructor(
    messageCode = "BAD_GATEWAY",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 502,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "BadGatewayError";
  }
}

/**
 * 503 - Service Unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(
    messageCode = "SERVICE_UNAVAILABLE",
    replaceMsgObj: Record<string, string> = {},
    data: Record<string, unknown> | null = null,
  ) {
    super({
      statusCode: 503,
      messageCode,
      replaceMsgObj,
      data,
      success: RESPONSE_STATUS.ERROR,
    });

    this.name = "ServiceUnavailableError";
  }
}
