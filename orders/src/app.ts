import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { json } from "body-parser";

import { errorHandler, NotFoundError, currentUser } from "@goodtickets/common";
import { createOrderRouter } from "./routes/create-order";
import { fetchOrdersRouter } from "./routes/fetch-orders";
import { fetchOrderRouter } from "./routes/fetch-order";
import { deleteOrderRouter } from "./routes/delete-order";

const app = express();
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUser);
app.use(createOrderRouter);
app.use(fetchOrdersRouter);
app.use(fetchOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };