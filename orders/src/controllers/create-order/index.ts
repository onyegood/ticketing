import { natsWrapper } from './../../nats-wrapper';
import { OrderCreatedPublisher } from './../../events/publishers/OrderCreatedPublisher';
import { NotFoundError, OrderStatus, BadRequestError } from '@goodtickets/common';
import { NextFunction, Request, Response } from 'express';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

export default async (req: Request, res: Response, next: NextFunction) => {
  const { ticketId } = req.body;
  // Find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  // Make sure that this ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  // Calculate the expiration date for the order
  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  // // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

// Publish an event saying that an order was created
new OrderCreatedPublisher(natsWrapper.client).publish({
  id: order.id,
  version: order.version,
  status: order.status,
  userId: order.userId,
  expiresAt: order.expiresAt.toISOString(),
  ticket: {
    id: ticket.id,
    price: ticket.price
  }
});

res.status(201).send(order);
}