import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import crypto from "node:crypto";
import {
  MAX_FILE_SIZE,
  S3_FOLDERS,
} from "../common/constants/app.constants.js";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from "../common/constants/env.js";
import logger from "../utils/logger.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const defaultImage = S3_FOLDERS.DEFAULT;
const s3 = new S3Client({
  credentials: {
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
  },
  region: AWS_REGION,
});
/**
 * Determines whether a file buffer is within the allowed size limit.
 *
 * @param options - The buffer and its maximum permitted size.
 * @returns `true` when the buffer size does not exceed the allowed size.
 */
export const checkMaxFileSize = function ({ buffer, maxSize = 5 }) {
  const allowedSize = maxSize || MAX_FILE_SIZE;
  const bufferSize = buffer?.length;
  const fileSizeInMb = bufferSize / (1024 * 1024);
  return bufferSize <= allowedSize;
};
/**
 * Uploads a file to S3 using a generated, optionally ID-prefixed filename.
 *
 * @param options - The file contents, MIME type, destination folder, and optional ID prefix.
 * @returns The S3 upload response and the generated filename.
 * @throws Rethrows errors returned while uploading the file.
 */
export const saveFileToStorage = async ({
  fileData,
  fileType,
  folderName: folderName,
  id = null,
}) => {
  try {
    const extension = fileType.split("/")[1];
    const uniqueId =
      typeof crypto.randomUUID == "function"
        ? crypto.randomUUID()
        : crypto.randomBytes(16).toString();
    let fileName = `${uniqueId}.${extension}`;
    if (id) fileName = `${id}_${fileName}`;
    const keyName = `${folderName}${fileName}`;
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: keyName,
      Body: fileData,
      ContentType: fileType,
      ContentDisposition: "inline",
    };
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    return { data, key: fileName };
  } catch (err) {
    logger.error("Error Occurred While Saving file to Storage" + err);
    throw err;
  }
};
/**
 * Deletes an existing file from the configured S3 bucket.
 *
 * @param options - The file key and folder containing it.
 * @throws Rethrows errors returned while checking or deleting the file.
 */
export const deleteFileFromStorage = async ({ key, folderName }) => {
  logger.info("Deleting File from Storage");
  try {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${folderName}${key}`,
    };
    const deleteCommand = new DeleteObjectCommand(params);
    const isFileExist = await fileExistOnStorage({ folderName, key });
    if (isFileExist) {
      await s3.send(deleteCommand);
      logger.info(`Deleted File With Name ${key} From Storage`);
    }
  } catch (err) {
    logger.error("Error Occurred While Deleting File From Storage", err);
    throw err;
  }
};
/**
 * Checks whether a file can be retrieved from the configured S3 bucket.
 *
 * @param options - The file key and folder containing it.
 * @returns `true` when S3 returns an object for the file; otherwise `false`.
 * @throws Rethrows errors returned by S3.
 */
export const fileExistOnStorage = async ({ key, folderName }) => {
  logger.info("Checking If File Exists on Storage");
  try {
    const param = { Bucket: AWS_S3_BUCKET_NAME, Key: `${folderName}${key}` };
    const getCommand = new GetObjectCommand(param);
    const response = await s3.send(getCommand);
    if (response) {
      logger.info(`File With Name ${key} Fetched Successfully`);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error Occurred While Checking File Exists on Storage", err);
    throw err;
  }
};
/**
 * Creates a signed URL for a stored file, falling back to the default image when absent.
 *
 * @param options - The file key and folder containing it.
 * @returns A signed S3 URL that expires after ten minutes.
 * @throws Rethrows errors returned while resolving the file or creating its URL.
 */
export const getStorageFileUrl = async ({ key, folderName }) => {
  logger.info("Fetching File Access Url From Storage Service Provide");
  try {
    const param = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${folderName}${key}`,
    };
    try {
      const headObjectCommand = new HeadObjectCommand(param);
      await s3.send(headObjectCommand);
    } catch (err) {
      logger.info(
        `No File With Key ${key} Found On Storage Returning Default Image`,
      );
      param.Key = defaultImage;
      const getObjectCommand = new GetObjectCommand(param);
      return getSignedUrl(s3, getObjectCommand, { expiresIn: 600 });
    }
    const getObjectCommand = new GetObjectCommand(param);
    const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 600 });
    return url;
  } catch (err) {
    logger.error("Error Occurred While Fetching The File Access Url", err);
    throw err;
  }
};
