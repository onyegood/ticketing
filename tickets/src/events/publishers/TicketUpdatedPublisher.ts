import { natsWrapper } from './../../nats-wrapper';
import {Publisher, Subjects, TicketUpdatedEvent}  from '@goodtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

// new TicketUpdatedPublisher(natsWrapper.client).publish({

// })