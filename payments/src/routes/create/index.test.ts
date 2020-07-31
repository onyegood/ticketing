import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

it('return 404 when purchesing an order that does not exist.', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: mongoose.Types.ObjectId().toHexString(),
      token: 'bjxjjhjjjjnjjn'
    })
    .expect(404)

});

it('return 401 when purchesing an order that does not belong to the user.', async () => {

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 100,
    status: OrderStatus.Created
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: order.id,
      token: 'bjxjjhjjjjnjjn'
    })
    .expect(401)
});

it('return 400 when purchesing a cancelled order.', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 100,
    status: OrderStatus.Cancelled
  });
  await order.save();
  
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'bjxjjhjjjjnjjn'
    })
    .expect(400)
});

it('return 201 with valid input', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    const stripeCharge = stripeCharges.data.find((charge) => {
      return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
      order: order.id,
      stripeId: stripeCharge!.id
    });
    expect(payment).not.toBeNull();
});