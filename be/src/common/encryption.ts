import crypto from "node:crypto";
import logger from "../utils/logger.js";
import {
  ENCRYPTION_ALGORITHM,
  ENCRYPTION_ROUNDS,
  ENCRYPTION_SECRET,
  HASHING_ALGORITHM,
  SECRET_SIZE,
} from "./constants/env.js";

export const encryptPayload = (payload: any) => {
  logger.info("Starting Execution Of encryptPayload encryption function");
  try {
    const encryptionAlgorithm = ENCRYPTION_ALGORITHM;
    const hashingAlgorithm = HASHING_ALGORITHM;
    const rounds = ENCRYPTION_ROUNDS;
    const secret = ENCRYPTION_SECRET ?? "1234567890";
    const keySize = SECRET_SIZE;
    const salt = crypto
      .createHash(hashingAlgorithm)
      .update(secret)
      .digest("hex");
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(
      secret,
      Buffer.from(salt, "hex"),
      rounds,
      keySize,
      hashingAlgorithm,
    );
    let cipher = crypto.createCipheriv(
      encryptionAlgorithm,
      Buffer.from(key),
      iv,
    );
    let encryptedValue = cipher.update(JSON.stringify(payload), "utf8", "hex");
    encryptedValue += cipher.final("hex");
    return {
      iv: iv.toString("hex"),
      value: encryptedValue,
    };
  } catch (err: any) {
    logger.error(
      "Error Occurred while executing the encryptPayload encryption function",
      err,
    );
    throw err;
  }
};

export const decryptPayloadString = (payload: string) => {
  logger.info("Started Execution Of decryptPayloadString decryption function");
  try {
    const encryptionAlgorithm = ENCRYPTION_ALGORITHM;
    const hashingAlgorithm = HASHING_ALGORITHM;
    const rounds = ENCRYPTION_ROUNDS;
    const secret = ENCRYPTION_SECRET ?? "1234567890";
    const keySize = SECRET_SIZE;
    const encryptedPayload: { iv: string; value: string } = JSON.parse(payload);
    const iv = Buffer.from(encryptedPayload?.iv, "hex");
    const salt = crypto
      .createHash(hashingAlgorithm)
      .update(secret)
      .digest("hex");
    const key = crypto.pbkdf2Sync(
      secret,
      Buffer.from(salt, "hex"),
      rounds,
      keySize,
      hashingAlgorithm,
    );
    const decipher = crypto.createDecipheriv(
      encryptionAlgorithm,
      Buffer.from(key),
      iv,
    );
    let decryptedString = decipher.update(
      encryptedPayload.value,
      "hex",
      "utf-8",
    );
    decryptedString += decipher.final("utf-8");
    return JSON.parse(decryptedString);
  } catch (err) {
    console.log(
      "Error Occurred while Executing decryptPayloadString decryption function",
      err,
    );
    throw err;
  }
};
