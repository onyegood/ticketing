import { NextFunction, Request, Response } from "express";
import { Payment } from '../../models/payment';


export default async (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {

  const payments = await Payment.find({}).populate('order');

  res.status(200).send(payments);
}