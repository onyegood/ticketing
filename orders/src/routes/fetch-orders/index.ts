import express  from 'express';
import { requireAuth } from '@goodtickets/common';
import fetchOrdersController from '../../controllers/fetch-orders';

const router = express.Router();

router.get('/api/orders', requireAuth, fetchOrdersController);

export {router as fetchOrdersRouter};




