import jwt, { type SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../common/constants/env.js";
import { decryptPayloadString, encryptPayload } from "../common/encryption.js";
import { ITokenPayload } from "../types/common.types.js";
const jwtSecret = JWT_SECRET;
export const generateToken = (
  payload: ITokenPayload,
  expiresIn: SignOptions["expiresIn"],
): string => {
  const encryptedPayload = encryptPayload(payload);
  const token = jwt.sign(encryptedPayload, jwtSecret, {
    expiresIn,
  });
  return token;
};
export const validateToken = (token: string): ITokenPayload => {
  const encryptedPayload = jwt.verify(token, jwtSecret) as string;
  return decryptPayloadString(encryptedPayload);
};
