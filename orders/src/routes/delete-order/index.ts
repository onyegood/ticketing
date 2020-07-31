import express  from 'express';
import { requireAuth, validateRequest } from '@goodtickets/common';
import deleteOrderController from '../../controllers/delete-order';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, validateRequest, deleteOrderController);

export {router as deleteOrderRouter};




