import * as problemsRepository from "./problems.repository.js";
import createProblemsService from "./problems.service.js";
import createProblemsController from "./problems.controller.js";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  validateGetAllProblemsParams,
  validateGetProblemDetailsParam,
} from "./problems.validator.js";
import { AUTH_PARAM } from "../../common/constants/app.constants.js";

const router = Router();

const problemsService = createProblemsService(problemsRepository);
const problemController = createProblemsController(problemsService);

router.get(
  "/getAll",
  authMiddleware(AUTH_PARAM.DYNAMIC),
  validateGetAllProblemsParams,
  problemController.getAllProblems,
);
router.get(
  "/getById/:problemId",
  authMiddleware(AUTH_PARAM.DYNAMIC),
  validateGetProblemDetailsParam,
  problemController.getProblemDetails,
);
export default router;
