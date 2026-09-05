import bcrypt from "bcrypt";
import { UserCreateInput } from "../../../prisma/generated/prisma/models.js";
import {
  ACCESS_TOKEN_EXPIRY,
  HTTP_CODE,
  REFRESH_TOKEN_EXPIRY,
} from "../../common/constants/code.constants.js";
import { RESPONSE_STATUS } from "../../common/constants/code.constants.js";
import {
  isValidEmail,
  isValidMobileNumber,
  isValidName,
  isValidUserName,
} from "../../common/validation.js";
import { ApiError } from "../../utils/error.js";
import logger from "../../utils/logger.js";
import { TAuthRepository } from "./auth.types.js";
import { TOKEN_TYPE } from "../../common/constants/enum.constants.js";
import { generateToken } from "../../utils/jwt.js";
import {
  deleteFileFromStorage,
  getStorageFileUrl,
  saveFileToStorage,
} from "../../integrations/s3.js";
import { S3_FOLDERS } from "../../common/constants/app.constants.js";
import { ITokenPayload } from "../../types/common.types.js";

/**
 * Creates Auth business operations backed by a user repository.
 *
 * @param userRepository - The data-access operations used by Auth.
 * @returns Service methods for signing up and logging in users.
 */
const createAuthService = (userRepository: TAuthRepository) => {
  return {
    /**
     * Creates a user and returns user data with access and refresh tokens.
     *
     * @param reqBody - The data used to create the user.
     * @param file - An optional profile image uploaded with the request.
     * @returns The created user and authentication tokens.
     * @throws Rethrows repository and token-generation errors.
     */
    signup: async (
      reqBody: UserCreateInput & { password: string },
      file: Express.Multer.File | undefined,
    ) => {
      logger.info("Started Execution Of Signup User Service");
      let uploadImageKey = null;
      try {
        if (file) {
          const storageResponse = await saveFileToStorage({
            fileData: file.buffer,
            fileType: file.mimetype,
            folderName: S3_FOLDERS.USER,
            id: reqBody.userName,
          });
          uploadImageKey = storageResponse.key;
          reqBody.avatarUrl = uploadImageKey;
        }
        const { password, ...userDetails } = reqBody;
        userDetails.passwordHash = password;
        userDetails.lastActive = new Date();
        userDetails.lastLoginAt = new Date();

        const user = await userRepository.createUser(userDetails);
        const nextStep = "VERIFY_MOBILE_NUMBER";
        const accessTokenPayload: ITokenPayload = {
          id: user.id,
          name: user.name,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          nextStep,
          token_type: TOKEN_TYPE.ACCESS_TOKEN,
        };
        const refreshTokenPayload: ITokenPayload = {
          id: user.id,
          name: user.name,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          nextStep,
          token_type: TOKEN_TYPE.REFRESH_TOKEN,
        };
        const accessToken = await generateToken(
          accessTokenPayload,
          ACCESS_TOKEN_EXPIRY,
        );
        const refreshToken = await generateToken(
          refreshTokenPayload,
          REFRESH_TOKEN_EXPIRY,
        );
        console.log(refreshToken, accessToken);
        const avatarUrl = await getStorageFileUrl({
          key: user.avatarUrl ?? "",
          folderName: S3_FOLDERS.USER,
        });
        const { passwordHash, ...restUser } = user;
        return {
          refreshToken,
          accessToken,
          ...restUser,
          avatarUrl,
          nextStep,
        };
      } catch (err: any) {
        if (uploadImageKey) {
          await deleteFileFromStorage({
            key: uploadImageKey,
            folderName: S3_FOLDERS.USER,
          });
        }
        logger.error(
          "Error Occurred While Executing the Signup User Service",
          err,
        );
        throw err;
      }
    },
    /**
     * Authenticates a user by email, mobile number, name, or username.
     *
     * @param credentials - The user's identifier and password.
     * @returns The authenticated user and authentication tokens.
     * @throws {ApiError} When the identifier or password is invalid.
     */
    login: async ({ id, password }: { id: string; password: string }) => {
      logger.info("Started Execution Of login User Service");
      try {
        const isIdEmail = isValidEmail(id);
        const isIdMobileNumber = isValidMobileNumber(id);
        const isIdValidName = isValidName(id);
        const isIdValidUserName = isValidUserName(id);
        const conditions = [];
        if (isIdEmail) conditions.push({ email: id });
        if (isIdMobileNumber) conditions.push({ mobileNumber: id });
        if (isIdValidName) conditions.push({ name: id });
        if (isIdValidUserName) conditions.push({ userName: id });
        const users = await userRepository.getUsersByOptions(conditions);
        if (!users) {
          throw new ApiError({
            statusCode: HTTP_CODE.OK,
            success: RESPONSE_STATUS.SUCCESS,
            messageCode: "INVALID_FIELD_VALUE",
            replaceMsgObj: { field1: "id" },
          });
        }
        const user = users.find(({ passwordHash }) =>
          bcrypt.compareSync(password, passwordHash),
        );
        if (!user) {
          throw new ApiError({
            statusCode: HTTP_CODE.OK,
            success: RESPONSE_STATUS.SUCCESS,
            messageCode: "INVALID_FIELD_VALUE",
            replaceMsgObj: { field1: "password" },
          });
        }
        const nextStep = user.mobileNumberVerifiedAt
          ? user.emailVerifiedAt
            ? "DASHBOARD"
            : "VERIFY_EMAIL"
          : "VERIFY_MOBILE_NUMBER";

        const accessTokenPayload: ITokenPayload = {
          id: user.id,
          name: user.name,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          nextStep,
          token_type: TOKEN_TYPE.ACCESS_TOKEN,
        };
        const refreshTokenPayload: ITokenPayload = {
          id: user.id,
          name: user.name,
          userName: user.userName,
          mobileNumber: user.mobileNumber,
          nextStep,
          token_type: TOKEN_TYPE.REFRESH_TOKEN,
        };
        const avatarUrl = await getStorageFileUrl({
          key: user.avatarUrl ?? "",
          folderName: S3_FOLDERS.USER,
        });
        const { passwordHash, ...restUser } = user;
        return {
          [TOKEN_TYPE.ACCESS_TOKEN]: await generateToken(
            accessTokenPayload,
            ACCESS_TOKEN_EXPIRY,
          ),
          [TOKEN_TYPE.REFRESH_TOKEN]: await generateToken(
            refreshTokenPayload,
            REFRESH_TOKEN_EXPIRY,
          ),
          nextStep,
          ...restUser,
          avatarUrl,
        };
      } catch (err: any) {
        logger.error(
          "Error Occurred While Executing the login User Service",
          err,
        );
        throw err;
      }
    },
  };
};

export default createAuthService;
export type TAuthService = ReturnType<typeof createAuthService>;
