import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { createTicket } from "../../helpers/createTicket";

it('should fetch ticket by id failed with status code of 404', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  
  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it('should fetch ticket by id with status code of 200', async () => {
  const ticket = await createTicket();

  const response = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send({})
    .expect(200);
  
  expect(response.body.id).toEqual(ticket.body.id);
  expect(response.body.title).toEqual("Apple");
  expect(response.body.price).toEqual(20);
});