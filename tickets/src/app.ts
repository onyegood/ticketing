import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { json } from "body-parser";

import { createTicketRouter } from "./routes/create-ticket";
import { errorHandler, NotFoundError, currentUser } from "@goodtickets/common";
import { fetchTicketsRouter } from "./routes/fetch-tickets";
import { fetchTicketRouter } from "./routes/fetch-ticket";
import { updateTicketRouter } from "./routes/update-ticket";

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
app.use(createTicketRouter);
app.use(fetchTicketsRouter);
app.use(fetchTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };