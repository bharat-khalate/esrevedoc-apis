import {
  HTTP_CODE,
  RESPONSE_STATUS,
} from "../../common/constants/code.constants.js";
import { IPaginatedResponse } from "../../types/common.types.js";
import logger from "../../utils/logger.js";
import {
  IGetAllProblemsQuery,
  IProblems,
  TProblemsService,
} from "./problem.types.js";
import { Request, Response } from "express";

/**
 * Creates HTTP handlers for Problems operations.
 *
 * @param service - The Problems business operations used by the handlers.
 * @returns Express handlers for handling problems request.
 */
const createProblemsController = (problemsService: TProblemsService) => {
  return {
    /**
     * Returns Paginated Filtered list of problems.
     *
     * @param req - The Express request, with pagination and filter params.
     * @param res - The Express response used to send the result.
     */
    getAllProblems: async (req: Request, res: Response) => {
      logger.info("Started Execution Of getAllProblems Problems Controller");
      try {
        const id = req.user?.id;
        const query = req.query as unknown as IGetAllProblemsQuery;
        const response: IPaginatedResponse<IProblems> =
          await problemsService.getAllProblems(query, id);
        if (!response.result.length) {
          res.sendResponse({
            success: RESPONSE_STATUS.SUCCESS,
            statusCode: HTTP_CODE.OK,
            messageCode: "NO_DATA_FOUND",
            data: response,
          });
        }
        res.sendResponse({
          success: RESPONSE_STATUS.SUCCESS,
          statusCode: HTTP_CODE.OK,
          messageCode: "FIELDS_FETCHED_SUCCESSFULLY",
          replaceMsgObj: { field1: "Problems" },
          data: response,
        });
      } catch (err) {
        logger.error(
          "Error Occurred While Executing the getAllProblems Problems Controller",
          err,
        );
        throw err;
      }
    },
    /**
     * Returns details for the problem with examples.
     *
     * @param req - The Express request, with problem id.
     * @param res - The Express response used to send the result.
     */
    getProblemDetails: async (req: Request, res: Response) => {
      logger.info("Started Execution Of getProblemDetails Problems Controller");
      try {
        const problemId = Number(req.params.problemId);
        const userId = req.user?.id;
        const response = await problemsService.getProblemDetails(
          problemId,
          userId,
        );
        if (!response) {
          res.sendResponse({
            success: RESPONSE_STATUS.ERROR,
            statusCode: HTTP_CODE.BAD_REQUEST,
            messageCode: "NO_DATA_FOUND",
          });
        }
        res.sendResponse({
          success: RESPONSE_STATUS.SUCCESS,
          statusCode: HTTP_CODE.OK,
          messageCode: "FIELDS_FETCHED_SUCCESSFULLY",
          replaceMsgObj: { field1: "Problem Details" },
          data: response,
        });
      } catch (err) {
        logger.error(
          "Error Occurred While Executing the getProblemDetails Problems Controller",
          err,
        );
        throw err;
      }
    },
  };
};

export default createProblemsController;
