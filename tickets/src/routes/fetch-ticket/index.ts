import express from 'express';
import fetchTicketController from "../../controllers/fetch-ticket";
import { validateRequest } from '@goodtickets/common';

const router = express.Router();

router.get('/api/tickets/:id', validateRequest, fetchTicketController);

export { router as fetchTicketRouter };