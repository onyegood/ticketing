import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@goodtickets/common';
import { queueGroupName } from './QueueGroupName';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    await expirationQueue.add({
      orderId: data.id
    }, 
    {
      delay
    }
    );

    // Ack the message
    msg.ack();
  };
}