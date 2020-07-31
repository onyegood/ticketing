import { NextFunction, Request, Response } from 'express';
import { Order } from '../../models/order';

export default async (req: Request, res: Response, next: NextFunction) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  })
  .populate('ticket');

  res.status(200).send(orders);
}