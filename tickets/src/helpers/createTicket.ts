import request from 'supertest';
import { app } from '../app';

export const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: "Apple",
      price: '20'
    })
    .expect(201);
}