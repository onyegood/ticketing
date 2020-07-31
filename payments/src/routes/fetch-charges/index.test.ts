import request from 'supertest';
import { app } from '../../app';

it('return 200 when successfully fetched payments.', async () => {
  await request(app)
    .get('/api/payments')
    .set('Cookie', global.signin())
    .send({})
    .expect(200)
});

