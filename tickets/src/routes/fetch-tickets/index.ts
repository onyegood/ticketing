import express from 'express';
import fetchTicketsController from "../../controllers/fetch-tickets";
import { validateRequest } from '@goodtickets/common';

const router = express.Router();

router.get('/api/tickets', validateRequest, fetchTicketsController);

export { router as fetchTicketsRouter };