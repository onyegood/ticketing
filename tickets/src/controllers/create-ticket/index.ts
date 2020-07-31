import { natsWrapper } from '../../nats-wrapper';
import { BadRequestError } from '@goodtickets/common';
import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../../models/tickets';
import { TicketCreatedPublisher } from '../../events/publishers/TicketCreatedPublisher';

export default async (req: Request, res: Response, next: NextFunction) => {
    
    const {title, price} = req.body;

    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    // Publish an Event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });
    
    res.status(201).send(ticket);
}