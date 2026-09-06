export const HTTP_CODE: Record<string, number> = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500,
  FORBIDDEN: 403,
};
export const RESPONSE_STATUS: Record<string, number> = {
  SUCCESS: 1,
  ERROR: 0,
  AUTH_FAIL: 4,
  PROXY: 17,
  INVALID_DATA: 2,
  KYC_FAILED: 3,
};
export const ACCESS_TOKEN_EXPIRY = "5d";
export const REFRESH_TOKEN_EXPIRY = "15d";
