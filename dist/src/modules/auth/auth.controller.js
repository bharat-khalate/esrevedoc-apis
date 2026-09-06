import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../../common/constants/code.constants.js";
import logger from "../../utils/logger.js";
/**
 * Creates HTTP handlers for Auth operations.
 *
 * @param service - The Auth business operations used by the handlers.
 * @returns Express handlers for signing up and logging in.
 */
const createAuthController = (service) => {
  return {
    /**
     * Registers a user and returns their authentication data.
     *
     * @param req - The signup request, optionally including a profile image.
     * @param res - The Express response used to send the result.
     */
    signup: async (req, res) => {
      logger.info("Starting Execution of the signup Auth Controller");
      try {
        const reqBody = req.body;
        const file = req.file;
        const result = await service.signup(reqBody, file);
        return res.sendResponse({
          statusCode: HTTP_CODE.OK,
          success: RESPONSE_STATUS.SUCCESS,
          messageCode: "SIGNUP_SUCCESSFULLY",
          data: result,
        });
      } catch (err) {
        logger.error("Error While Executing signup auth controller", err);
        throw err;
      }
    },
    /**
     * Authenticates a user and returns their authentication data.
     *
     * @param req - The login request containing the user's credentials.
     * @param res - The Express response used to send the result.
     */
    login: async (req, res) => {
      logger.info("Starting Execution of the login Auth Controller");
      try {
        const reqBody = req.body;
        const result = await service.login(reqBody);
        return res.sendResponse({
          statusCode: HTTP_CODE.OK,
          success: RESPONSE_STATUS.SUCCESS,
          messageCode: "LOGIN_SUCCESSFULLY",
          data: result,
        });
      } catch (err) {
        logger.error("Error While Executing signup auth controller", err);
        throw err;
      }
    },
  };
};
export default createAuthController;
