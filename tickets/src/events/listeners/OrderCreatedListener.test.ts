import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@goodtickets/common';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from './../../nats-wrapper';
import { OrderCreatedListener } from './OrderCreatedListener';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save the ticket
  const ticket = Ticket.build({
    title: 'Hello',
    price: 23,
    userId: 'gshdhbff'
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'skmksnknsdd',
    expiresAt: 'dnkdkdnd',
    ticket: {
        id: ticket.id,
        price: ticket.price
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('sets the userId of the ticket', async () => {
  const {listener, data, ticket, msg} = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('ack the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(data.id).toEqual(ticketUpdatedData.orderId);
  expect(data.ticket.id).toEqual(ticketUpdatedData.id);
});