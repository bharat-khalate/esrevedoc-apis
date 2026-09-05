import multer from "multer";

const storage = multer.memoryStorage();

/**
 * Base multer instance with memory storage and size limits.
 * @type {import("express").RequestHandler}
 */
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/**
 * Multer middleware for handling single file uploads in memory.
 * @type {import("express").RequestHandler}
 */
export const uploadSingle = (fileName: string = "file") =>
  upload.single(fileName);
