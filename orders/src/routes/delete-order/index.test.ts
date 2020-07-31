import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('cancel active order', async () => {
    // Create ticket with ticket model
    const ticket  = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "Hello bro",
      price: 300
    });
    await ticket.save();

  const user = global.signin();

  // Make a request to create an order
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to cancel and order
  await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', user)
      .send()
      .expect(204);

  // Expect that the order status to be cancilled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

});

it('publishes order:cancelled event when order is cancelled successfully', async () => {
  const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "Hello",
      price: 20
    });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});