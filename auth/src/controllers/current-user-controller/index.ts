import {Request, Response, NextFunction} from "express";

export default async (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
    return res.status(200).send({
      currentUser: req.currentUser || null
    });
}