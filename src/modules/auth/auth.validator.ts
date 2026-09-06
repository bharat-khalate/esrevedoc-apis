import { NextFunction, Request, Response } from "express";
import {
  isValidEmail,
  isValidMobileNumber,
  isValidName,
  isValidPassword,
  isValidUserName,
  requiredFieldValidation,
} from "../../common/validation.js";
import { ValidationError } from "../../utils/error.js";

export const validateSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reqBody = req.body;
  const requiredFields = [
    "name",
    "userName",
    "mobileNumber",
    "email",
    "password",
  ];
  const missingFields = requiredFieldValidation({ requiredFields, reqBody });
  console.log(missingFields);
  if (missingFields?.length) {
    throw new ValidationError("MISSING_REQUIRED_FIELDS", {
      field1: missingFields.join(", "),
    });
  }
  const { name, userName, mobileNumber, email, password } = reqBody;
  if (!isValidName(name)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "name",
    });
  }
  if (!isValidUserName(userName)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "user name",
    });
  }

  if (!isValidMobileNumber(mobileNumber)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "mobile number",
    });
  }

  if (!isValidMobileNumber(mobileNumber)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "mobile number",
    });
  }

  if (!isValidEmail(email)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "email",
    });
  }

  if (!isValidPassword(password)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "password",
    });
  }

  return next();
};

export const validateLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const reqBody = req.body;
  const requiredFields = ["id", "password"];
  const missingFields = requiredFieldValidation({ requiredFields, reqBody });
  if (missingFields?.length) {
    throw new ValidationError("MISSING_REQUIRED_FIELDS", {
      field1: missingFields.join(", "),
    });
  }
  const { id, password } = reqBody;
  if (!(
    isValidName(id) ||
    isValidUserName(id) ||
    isValidEmail(id) ||
    isValidMobileNumber(id)
  )) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "id",
    });
  }
  if (!isValidPassword(password)) {
    throw new ValidationError("INVALID_FIELD_VALUE", {
      field1: "password",
    });
  }
  next();
};
