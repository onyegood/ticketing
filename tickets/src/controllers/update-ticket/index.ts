import { natsWrapper } from '../../nats-wrapper';
import { UserNotAuthorized, NotFoundError, BadRequestError } from '@goodtickets/common';
import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../../models/tickets';
import { TicketUpdatedPublisher } from '../../events/publishers/TicketUpdatedPublisher';

export default async (req: Request, res: Response, next: NextFunction) => {
  const {title, price} = req.body;
  const id = req.params.id;

  const ticket = await Ticket.findById(id);
  
  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.orderId) {
    throw new BadRequestError('Can not edit a reserved ticket');
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new UserNotAuthorized();
  }

  ticket.set({ price, title });

  await ticket.save();

  // Publish an Event
  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.status(200).send(ticket);
}