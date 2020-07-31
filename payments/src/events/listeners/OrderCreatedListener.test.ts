import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@goodtickets/common';
import mongoose from 'mongoose';
import { natsWrapper } from './../../nats-wrapper';
import { OrderCreatedListener } from "./OrderCreatedListener"
import { Order } from '../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'hduhudh',
    expiresAt: 'jjjdjnd',
    ticket: {
        id: 'uuhuhduh',
        price: 10
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }


  return {listener, data, msg}
}

it('replicate the order information', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toBe(data.ticket.price);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});