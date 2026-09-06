import {
  emailRegEx,
  mobileNumberRegEx,
  nameRegEx,
  passwordRegEx,
  userNameRegEx,
} from "./constants/regExp.js";

/**
 * Validate If required fields present in reqBody
 * @param {string[]} requiredFields - requiredFields string list
 * @param {object} reqBody- object in which fields should be present
 * @returns {string[]} list of missing fields;
 */
export const requiredFieldValidation = ({
  requiredFields,
  reqBody,
}: {
  requiredFields: string[];
  reqBody: Record<string, any>;
}) => {
  return requiredFields.filter((key) => !Object.hasOwn(reqBody, key));
};

/**
 * Helper to validate name string, verifies string doesn't consist any number od special character
 * @param{string} name- string to validate
 * @returns {boolean} - true if name is valid
 */
export const isValidName = (name: string) => {
  return nameRegEx.test(name);
};

/**
 * Helper to validate userName string, verifies string contains only alphabet,numbers and underscore only
 * @param{string} userName- string to validate
 * @returns {boolean} - true if userName is valid
 */
export const isValidUserName = (userName: string) => {
  return userNameRegEx.test(userName);
};

/**
 * Validates a mobile number.
 *
 * @param {string} mobileNumber - Mobile number to validate.
 * @returns {boolean} - True if the mobile number is valid, otherwise false.
 */
export const isValidMobileNumber = (mobileNumber: string) => {
  return mobileNumberRegEx.test(mobileNumber);
};

/**
 * Validates an email address.
 *
 * @param {string} email - Email address to validate.
 * @returns {boolean} - True if the email address is valid, otherwise false.
 */
export const isValidEmail = (email: string) => {
  return emailRegEx.test(email);
};

/**
 * Validates a password.
 *
 * @param {string} password - Password to validate.
 * @returns {boolean} - True if the password is valid, otherwise false.
 */
export const isValidPassword = (password: string) => {
  return passwordRegEx.test(password);
};

/**
 * Validates a pagination params.
 *
 * @param {Object} query - query including pagination options.
 * @returns {boolean} - True if the password is valid, otherwise false.
 */
export const isValidPagination = (query: Record<string, any>) => {
  const requiredFields = ["page", "limit"];
  const missingField = requiredFieldValidation({
    requiredFields,
    reqBody: query,
  });
  return missingField.length;
};

export const isValidEnumValue = <T extends Record<string, string>>(
  enumObj: T,
  value: string,
): value is T[keyof T] => {
  return Object.values(enumObj).includes(value as T[keyof T]);
};

export const isValidNumber = (value: unknown) => {
  if (!value) return false;
  return Number.isFinite(Number(value));
};
