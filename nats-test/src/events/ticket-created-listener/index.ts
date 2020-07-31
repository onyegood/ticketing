import { Listener, Publisher, Subjects, TicketCreatedEvent } from '@goodtickets/common';
import {Stan, Message} from 'node-nats-streaming';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service-group";
  onMessage(data: TicketCreatedEvent['data'], msg: Message){
    console.log('Event data', data);

    msg.ack();
  }
}