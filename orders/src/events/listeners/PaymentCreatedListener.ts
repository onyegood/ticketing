import {Message} from 'node-nats-streaming';
import {PaymentCreatedEvent, Subjects, Listener, OrderStatus} from '@goodtickets/common';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener <PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
    const order = await Order.findById(data.order.id);
    
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Completed });
    await order.save();

    msg.ack();
  }
}