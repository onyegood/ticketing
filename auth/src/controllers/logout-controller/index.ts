import {Request, Response, NextFunction} from "express";

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
    req.session = null;

    res.status(200).send({});
}