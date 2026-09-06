/**
 * Regular expression for validating a person's name.
 * Allows only uppercase letters, lowercase letters, and spaces.
 */
export const nameRegEx = /^[A-Za-z ]+$/;
/**
 * Regular expression for validating a username.
 * Allows only uppercase letters, lowercase letters, numbers, and underscores.
 */
export const userNameRegEx = /^[A-Za-z0-9_]+$/;
/**
 * Regular expression for validating a mobile number.
 * Allows exactly 10 numeric digits.
 */
export const mobileNumberRegEx = /^[0-9]{10}$/;
/**
 * Regular expression for validating an email address.
 * Requires a valid username, domain, and domain extension.
 */
export const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Regular expression for validating a password.
 * Requires a minimum of 8 characters.
 */
export const passwordRegEx = /^.{8,}$/;
