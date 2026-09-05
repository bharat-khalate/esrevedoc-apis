import { Router } from "express";
import { NotFoundError } from "../../utils/error.js";
import userRouter from "../../modules/auth/auth.routes.js";
import problemsRouter from "../../modules/problems/problems.routes.js";
import submissionRouter from "../../modules/submission/submission.routes.js";
const router = Router();

/**
 * Express Router aggregator for API Version 1 (v1).
 * Mounted under '/webservices/v1' base path.
 */

router.use(userRouter);
router.use("/problems", problemsRouter);
router.use("/submission", submissionRouter);

router.use((req, res, next) => {
  next(new NotFoundError("ROUTE_NOT_FOUND"));
});
export default router;
