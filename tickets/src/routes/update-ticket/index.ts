import express from 'express';
import { body } from 'express-validator';
import updateTicketController from "../../controllers/update-ticket";
import { requireAuth, validateRequest } from '@goodtickets/common';

const router = express.Router();

router.put('/api/tickets/:id', 
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
updateTicketController
);

export { router as updateTicketRouter };