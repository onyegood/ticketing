import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening on /api/orders for post request', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is logged in', async () => {
    await request(app)
      .post('/api/orders')
      .send({})
      .expect(401);
});

it('return a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return an error if invalid ticketId is provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ''
    })
    .expect(400);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserve a ticket', async () => {
    const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "Hello",
      price: 20
    });
    await ticket.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
      .expect(201);
});

it('publishes order:created event when order is created successfully', async () => {
  const ticket = Ticket.build({
      id: mongoose.Types.ObjectId().toHexString(),
      title: "Hello",
      price: 20
    });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});