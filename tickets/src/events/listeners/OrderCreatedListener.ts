import { TicketUpdatedPublisher } from './../publishers/TicketUpdatedPublisher';
import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@goodtickets/common';
import { queueGroupName } from './QueueGroupName';
import { Ticket } from '../../models/tickets';


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message){
    // Find the ticket the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    // Mark the ticket as been reserved by setting it's orderId property
    ticket.set({orderId: data.id});

    // Save the ticket
    await ticket.save();
    
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    });

    // Ack the message
    msg.ack();
  };
}