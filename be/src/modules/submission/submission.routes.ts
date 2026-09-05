import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { AUTH_PARAM } from "../../common/constants/app.constants.js";
import * as submissionRepository from "./submission.repository.js";
import {
  validateCreateRequest,
  validateGetAllRequest,
  validateGetDetailsRequest,
} from "./submission.validator.js";
import createSubmissionService from "./submission.service.js";
import createSubmissionController from "./submission.controller.js";
const router = Router();

const submissionService = createSubmissionService(submissionRepository);
const submissionController = createSubmissionController(submissionService);

/**
 * @swagger
 * /submission/create:
 *   post:
 *     tags: [Submission]
 *     summary: Submit a solution for a problem
 *     description: Creates a submission for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, tcPassed, result, problemId, totalTc]
 *             properties:
 *               code:
 *                 type: string
 *                 description: Source code submitted for evaluation.
 *               tcPassed:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of test cases passed.
 *               totalTc:
 *                 type: integer
 *                 minimum: 0
 *                 description: Total number of test cases.
 *               problemId:
 *                 type: integer
 *                 minimum: 1
 *                 description: ID of the problem being solved.
 *               result:
 *                 type: string
 *                 enum: [passed, failed]
 *                 description: Result of the solution evaluation.
 *     responses:
 *       200:
 *         description: Solution submitted successfully.
 *       400:
 *         description: Request contains invalid submission data.
 *       401:
 *         description: Authentication is required.
 */
router.post(
  "/create",
  authMiddleware(AUTH_PARAM.STRICT),
  validateCreateRequest,
  submissionController.create,
);

/**
 * @swagger
 * /submission/getAll:
 *   get:
 *     tags: [Submission]
 *     summary: List the authenticated user's submissions
 *     description: Returns paginated submissions for a specific problem.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: problemId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: ID of the problem whose submissions should be returned.
 *       - in: query
 *         name: page
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: Number of submissions per page.
 *     responses:
 *       200:
 *         description: Paginated submissions returned successfully.
 *       400:
 *         description: Query parameters are invalid.
 *       401:
 *         description: Authentication is required.
 */
router.get(
  "/getAll",
  authMiddleware(AUTH_PARAM.STRICT),
  validateGetAllRequest,
  submissionController.getAll,
);

/**
 * @swagger
 * /submission/getDetails/{submissionId}:
 *   get:
 *     tags: [Submission]
 *     summary: Get submission details
 *     description: Returns a submission belonging to the authenticated user, including its notes.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: ID of the submission to retrieve.
 *     responses:
 *       200:
 *         description: Submission details returned successfully.
 *       400:
 *         description: Submission ID is invalid or the submission does not exist.
 *       401:
 *         description: Authentication is required.
 */
router.get(
  "/getDetails/:submissionId",
  authMiddleware(AUTH_PARAM.STRICT),
  validateGetDetailsRequest,
  submissionController.getDetails,
);

export default router;
