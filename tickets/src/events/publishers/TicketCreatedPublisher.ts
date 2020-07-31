import {Publisher, Subjects, TicketCreatedEvent}  from '@goodtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}