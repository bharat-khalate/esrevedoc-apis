import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../common/constants/env.js";
import { decryptPayloadString, encryptPayload } from "../common/encryption.js";
const jwtSecret = JWT_SECRET;
export const generateToken = (payload, expiresIn) => {
  const encryptedPayload = encryptPayload(payload);
  const token = jwt.sign(encryptedPayload, jwtSecret, {
    expiresIn,
  });
  return token;
};
export const validateToken = (token) => {
  const encryptedPayload = jwt.verify(token, jwtSecret);
  return decryptPayloadString(encryptedPayload);
};
