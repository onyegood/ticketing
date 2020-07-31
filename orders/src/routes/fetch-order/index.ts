import express  from 'express';
import { requireAuth, validateRequest } from '@goodtickets/common';
import fetchOrderController from '../../controllers/fetch-order';

const router = express.Router();

router.get('/api/orders/:id', requireAuth, validateRequest, fetchOrderController);

export {router as fetchOrderRouter};




