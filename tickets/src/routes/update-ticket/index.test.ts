import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/tickets';
import { natsWrapper } from '../../nats-wrapper';

it('should return a 404 error if ticket id is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Mango',
      price: 100
    })
    .expect(404);
});

it('should return a 401 error if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Mango',
      price: 100
    })
    .expect(401);
});

it('should return a 401 error if the user does not own the ticket', async () => {
  const ticket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', global.signin())
    .send({
      title: 'Mango',
      price: 100
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Mango',
      price: 100
    })
    .expect(401);
});


it('should return a 400 error if the user provides invalid title', async() => {
  const cookie = global.signin();

  const ticket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: 100
    });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 100
    })
    .expect(400);
});

it('should return a 400 error if the user provides invalid price', async() => {
  const cookie = global.signin();

  const ticket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: 100
    });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: -10
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango'
    })
    .expect(400);
});

it('should return a 200 if the user provides a valid title and price', async() => {
  const cookie = global.signin();

  const ticket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: 200
    });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Apple',
      price: 100
    })
    .expect(200);

  const response = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send()
    .expect(200);

    expect(response.body.title).toEqual('Apple');
    expect(response.body.price).toEqual(100);
});

it('publishes ticket:updated event on successful update', async () => {
  const cookie = global.signin();

  const data = {
    subject: "Hello",
    data: "Bro",
    callback: () => {}
  }

  const ticket = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: 200
    });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Apple',
      price: 100
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const data = {
    subject: "Hello",
    data: "Bro",
    callback: () => {}
  }

  const response = await request(app)
    .post(`/api/tickets`)
    .set('Cookie', cookie)
    .send({
      title: 'Mango',
      price: 200
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({orderId: mongoose.Types.ObjectId().toHexString()});
  ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Apple',
      price: 100
    })
    .expect(400);
})