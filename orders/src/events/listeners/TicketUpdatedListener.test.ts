import { TicketUpdatedEvent } from '@goodtickets/common';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedListener } from './TicketUpdatedListener';


const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Hello ticket',
    price: 30
  });

  await ticket.save();

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new data',
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  // Return all variables
  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call the onMessage function with the data and message object 
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  // Make assertions to make sure the ack function is called
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const {data, listener, msg} = await setup();

  // Call the onMessage function with the data and message object 
  await listener.onMessage(data, msg);

  // Make assertions to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const {listener, data, msg, ticket} = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    
  }

  expect(msg.ack).not.toHaveBeenCalled();
});