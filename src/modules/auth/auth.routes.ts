import { Router } from "express";
import * as authRepository from "./auth.repository.js";
import { uploadSingle } from "../../middlewares/multer.middleware.js";
import createAuthController, { TAuthController } from "./auth.controller.js";
import createAuthService, { TAuthService } from "./auth.service.js";
import { validateLogin, validateSignup } from "./auth.validator.js";

const route = Router();
const authService: TAuthService = createAuthService(authRepository);
const authController: TAuthController = createAuthController(authService);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, userName, mobileNumber, email, password]
 *             properties:
 *               name: { type: string }
 *               userName: { type: string }
 *               mobileNumber: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               profileImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: User registered successfully
 */
route.post(
  "/signup",
  uploadSingle("profileImage"),
  validateSignup,
  authController.signup,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, password]
 *             properties:
 *               id:
 *                 type: string
 *                 description: Email, mobile number, name, or username
 *               password: { type: string, format: password }
 *     responses:
 *       200:
 *         description: User authenticated successfully
 */
route.post("/login", validateLogin, authController.login);

export default route;
