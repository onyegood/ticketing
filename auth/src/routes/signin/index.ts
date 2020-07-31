import express from 'express';
import {body} from "express-validator";
import signinController from "../../controllers/signin-controller";
import { validateRequest } from '@goodtickets/common';

const router = express.Router();

router.post("/api/users/signin", 
[
  body('email')
  .isEmail()
  .withMessage("Email must be valid"),
  body("password")
  .trim()
  .notEmpty()
  .withMessage("Please supply password")
  .isLength({min: 5, max: 20})
  .withMessage("Password must be between 5 and 20 characters")
], 
validateRequest, 
signinController
);

export {router as signinUserRouter};