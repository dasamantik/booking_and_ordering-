import { body } from "express-validator";

export const registerValidator = [
  body("name").isLength({ min: 2 }).trim(),
  body("phone").isMobilePhone("uk-UA"),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

export const authValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];
