import { currentUser } from '@goodtickets/common';
import express from 'express';
import currentUserController from '../../controllers/current-user-controller';

const router = express.Router();

router.get("/api/users/me", currentUser, currentUserController);

export {router as currrentUserRouter};