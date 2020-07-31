import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent } from "@goodtickets/common";
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message){

    const {title, price} = data;

    // Note: findByEvent is my custom made code
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({title, price});
    await ticket.save();

    msg.ack();
  }
}