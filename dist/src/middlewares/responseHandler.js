import enMessages from "../common/languages/en/index.js";
import { replaceFieldText } from "../common/helper.js";
export const responseHandler = (req, res, next) => {
  res.sendResponse = ({
    statusCode,
    messageCode,
    data,
    success,
    replaceMsgObj,
  }) => {
    let message = enMessages[messageCode] || messageCode;
    if (replaceMsgObj && Object.keys(replaceMsgObj).length > 0) {
      message = replaceFieldText(message, replaceMsgObj);
    }
    const finalSuccess = statusCode >= 500 ? 0 : success;
    const finalResponse = {
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
