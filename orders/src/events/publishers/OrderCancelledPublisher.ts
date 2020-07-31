import {Publisher, Subjects, OrderCancelledEvent}  from '@goodtickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}