import { NotFoundError } from '@goodtickets/common';
import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../../models/tickets';

export default async (req: Request, res: Response, next: NextFunction) => {
  const ticket = await Ticket.find({
    orderId: undefined
  });

  res.status(200).send(ticket);
}