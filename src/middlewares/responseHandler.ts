import { NextFunction, Request, Response } from "express";
import enMessages from "../common/languages/en/index.js";
import { replaceFieldText } from "../common/helper.js";
import { IResponseHandlerParams } from "../types/common.types.js";
import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../common/constants/code.constants.js";
type TResponseStatus = (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.sendResponse = ({
    statusCode,
    messageCode,
    data,
    success,
    replaceMsgObj,
  }: IResponseHandlerParams) => {
    let message: string = (enMessages[messageCode] || messageCode) as string;
    if (replaceMsgObj && Object.keys(replaceMsgObj).length > 0) {
      message = replaceFieldText(message, replaceMsgObj);
    }
    const finalSuccess = statusCode >= 500 ? 0 : success;

    const finalResponse: {
      success: TResponseStatus;
      message: string;
      data?: Record<string, any>;
    } = {
      success: finalSuccess,
      message,
    };
    if (data != null) {
      finalResponse.data = data;
    }
    return res.status(statusCode).json(finalResponse);
  };
  next();
};
