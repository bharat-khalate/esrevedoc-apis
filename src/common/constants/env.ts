export const DATABASE_URL = process.env["DATABASE_URL"] || "";
export const PORT = process.env["PORT"] || "3000";
export const JWT_SECRET = process.env["JWT_SECRET"] || "1234567890";
export const ENCRYPTION_ALGORITHM =
  process.env.ENCRYPTION_ALGORITHM ?? "aes-256-gcm";
export const HASHING_ALGORITHM = process.env.HASHING_ALGORITHM ?? "sha256";
export const ENCRYPTION_ROUNDS = Number(
  process.env.ENCRYPTION_ROUNDS ?? 100_000,
);
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
export const SECRET_SIZE = Number(process.env.SECRET_SIZE ?? 256);
if (!ENCRYPTION_SECRET) {
  throw new Error("ENCRYPTION_SECRET is required");
}
export const BASIC_AUTH_USERNAME = process.env["BASIC_AUTH_USERNAME"];
export const BASIC_AUTH_PASSWORD = process.env["BASIC_AUTH_PASSWORD"] || "";
export const AWS_REGION = process.env["AWS_REGION"] ?? "eu-north-1";
export const AWS_S3_BUCKET_NAME =
  process.env["AWS_S3_BUCKET_NAME"] ?? "your-s3-bucket-nam";
export const AWS_ACCESS_KEY_ID =
  process.env["AWS_ACCESS_KEY_ID"] ?? "your-access-key-id";
export const AWS_SECRET_ACCESS_KEY =
  process.env["AWS_SECRET_ACCESS_KEY"] ?? "your-secret-access-key";
