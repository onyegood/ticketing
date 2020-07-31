import mongoose from 'mongoose';
import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest} from '@goodtickets/common';
import CreateOrderController from '../../controllers/create-order';

const router = express.Router();

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket ID must be provided')
], validateRequest, CreateOrderController);

export {router as createOrderRouter};




