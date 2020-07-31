import express from 'express';
import {body} from "express-validator";
import signupController from "../../controllers/signup-controller";
import { validateRequest } from '@goodtickets/common';

const router = express.Router();

router.post("/api/users/signup", 
[
  body('email')
  .isEmail()
  .withMessage("Email must be valid"),
  body("password")
  .trim()
  .isLength({min: 5, max: 20})
  .withMessage("Password must be between 5 and 20 characters")
], 
validateRequest, 
signupController
);

export {router as signupUserRouter};