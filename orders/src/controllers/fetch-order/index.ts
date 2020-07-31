import { NotFoundError, UserNotAuthorized } from '@goodtickets/common';
import { NextFunction, Request, Response } from 'express';
import { Order } from '../../models/order';

export default async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;

  const order = await Order.findById(id).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UserNotAuthorized();
  }

  res.status(200).send(order);
}