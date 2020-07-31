import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@goodtickets/common';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from './TicketCreatedListener';
import { Ticket } from '../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "Test ticket",
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg };
}

it('creates and save a ticket', async () => {
    const { data, listener, msg } = await setup();

  // Call the onMessage function with the data and message object 
  await listener.onMessage(data, msg);

  // Make assertions to make sure the ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {data, listener, msg} = await setup();

  // Call the onMessage function with the data and message object 
  await listener.onMessage(data, msg);

  // Make assertions to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});