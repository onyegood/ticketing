import { requireAuth, validateRequest } from "@goodtickets/common";
import express from "express";
import { body } from 'express-validator';
import CreateChargeController from '../../controllers/create-charge';

const router = express.Router();

router.post('/api/payments', 
  requireAuth, 
  [
    body('token')
    .not()
    .isEmpty(),
    body('orderId')
    .not()
    .isEmpty()
  ], 
  validateRequest,
  CreateChargeController
);

export { router as createChargeRouter }