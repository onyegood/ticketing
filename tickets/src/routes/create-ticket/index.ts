import express from 'express';
import { body } from 'express-validator';
import createTicketController from "../../controllers/create-ticket";
import { requireAuth, validateRequest } from '@goodtickets/common';

const router = express.Router();

router.post('/api/tickets', 
requireAuth, 
[
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isLength({min: 2})
    .withMessage('Title must be minimum of 2 characters'),
  body('price')
    .not()
    .isEmpty()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0')
],
validateRequest,
createTicketController
);

export { router as createTicketRouter };