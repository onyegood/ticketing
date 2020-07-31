import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { createTicket } from "../../helpers/createTicket";
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening on /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is logged in', async () => {
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401);
});

it('return a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

    expect(response.status).not.toEqual(401);
});

it('return an error if invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10
    })
    .expect(400);
});

it('return an error if invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Apple',
      price: -10
    })
    .expect(400);

    await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Apple'
    })
    .expect(400);
});

it('create a ticket with valid input', async () => {
    let ticket = await Ticket.find({});
    expect(ticket.length).toEqual(0);

    const title = "Apple";
    const price = 20;
    
    await createTicket();

    ticket = await Ticket.find({});

    expect(ticket.length).toEqual(1);
    expect(ticket[0].price).toEqual(price);
    expect(ticket[0].title).toEqual(title);
});

it('publishes ticket:created event when ticket is created successfully', async () => {
  await createTicket();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});