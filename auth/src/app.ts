import express from "express";
import 'express-async-errors';
import cookieSession from "cookie-session";
import { json } from "body-parser";

import { currrentUserRouter } from "./routes/current-user";
import { signupUserRouter } from "./routes/signup";
import { signinUserRouter } from "./routes/signin";
import { signoutUserRouter } from "./routes/logout";
import { errorHandler, NotFoundError } from "@goodtickets/common";

const app = express();
app.set("trust proxy", true);

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currrentUserRouter);
app.use(signupUserRouter);
app.use(signinUserRouter);
app.use(signoutUserRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };