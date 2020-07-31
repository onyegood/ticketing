import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@goodtickets/common';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCancelledListener } from './OrderCancelledListener';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create and save the ticket
  const ticket = Ticket.build({
    title: 'Hello',
    price: 23,
    userId: 'gshdhbff'
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
        id: ticket.id,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('updates the ticket', async () => {
  const {listener, data, ticket, msg} = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).not.toBeDefined();
});

it('ack the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes an event', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});