import { natsWrapper } from './../../nats-wrapper';
import { OrderCancelledPublisher } from './../../events/publishers/OrderCancelledPublisher';
import { NotFoundError, UserNotAuthorized } from '@goodtickets/common';
import { NextFunction, Request, Response } from 'express';
import { Order, OrderStatus } from '../../models/order';

export default async (req: Request, res: Response, next: NextFunction) => {

  const id = req.params.id;

  const order = await Order.findById(id).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId !== req.currentUser!.id) {
    throw new UserNotAuthorized();
  }

  order.status = OrderStatus.Cancelled;
  order.save();

  // publishing an event saying this was cancelled!
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id
    }
  });

  res.status(204).send(order);
}