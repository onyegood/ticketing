import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  // Create ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Hello",
    price: 300
  });
  await ticket.save();

  const user = global.signin();
  // Make a request to build an order with this ticket
  const {body: order} = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make a request to fetch the order
  const { body: fetchedOder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOder.id).toEqual(order.id);
});

it('return an error if try fetching another users order', async () => {
    // Create ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: "Hello",
      price: 300
    });
    await ticket.save();

    const user = global.signin();
    // Make a request to build an order with this ticket
    const {body: order} = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket.id })
      .expect(201)

    // Make a request to fetch the order
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(401);
});

it('return an error if try fetching another users order', async () => {
  // Make a request to fetch the order
  await request(app)
    .get(`/api/orders/${mongoose.Types.ObjectId()}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});