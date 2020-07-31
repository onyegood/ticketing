import request from 'supertest';
import { app } from '../../app';
import { createTicket } from "../../helpers/createTicket";

it('should fetch all tickets successfuly', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .send({})
    .expect(200);
  
  expect(response.body.length).toEqual(5);
  expect(response.body[0].title).toEqual('Apple');
  expect(response.body[0].price).toEqual(20);
});