import { Publisher, PaymentCreatedEvent, Subjects } from '@goodtickets/common';
export class PaymentCreatedPublisher extends Publisher <PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}