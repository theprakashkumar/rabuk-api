import { Request } from "express";
import { isEmail, isStrongPassword } from "validator";

export const validateSignUp = (req: Request) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields are required!");
  } else if (firstName.length < 3 || lastName.length < 3) {
    throw new Error("First and last name must be at least 3 characters long!");
  } else if (!isEmail(email)) {
    throw new Error("Invalid email!");
  } else if (!isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters long!");
  }
};

export const validateLogin = (req: Request) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("All fields are required!");
  } else if (!isEmail(email)) {
    throw new Error("Invalid email!");
  }
};
