import express from 'express';
import logoutController from "../../controllers/logout-controller";

const router = express.Router();

router.post("/api/users/signout", logoutController);

export {router as signoutUserRouter};