import { requireAuth } from "@goodtickets/common";
import express from "express";
import fetchChargesController from '../../controllers/fetch-charges';

const router = express.Router();

router.get('/api/payments', 
  requireAuth,
  fetchChargesController
);

export { router as fetchChargesRouter }