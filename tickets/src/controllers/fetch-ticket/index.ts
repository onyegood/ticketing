import { BadRequestError, NotFoundError } from '@goodtickets/common';
import { Request, Response, NextFunction } from 'express';
import { Ticket } from '../../models/tickets';

export default async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }
    
  res.status(200).send(ticket);
}