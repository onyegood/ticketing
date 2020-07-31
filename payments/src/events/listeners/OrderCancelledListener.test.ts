import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent, OrderStatus } from '@goodtickets/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from "./OrderCancelledListener"
import { Order } from '../../models/order';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'hduhudh',
    price: 100
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "jhdjbdjjd"
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }


  return {listener, data, msg}
}

it('update the status of the order', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.status).toBe(OrderStatus.Cancelled);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});