import { natsWrapper } from '../../nats-wrapper';
import { stripe } from './../../stripe';
import { 
  NotFoundError, 
  OrderStatus, 
  UserNotAuthorized, 
  BadRequestError 
} from "@goodtickets/common";
import { NextFunction, Request, Response } from "express";
import { Order } from "../../models/order";
import { Payment } from '../../models/payment';
import { PaymentCreatedPublisher } from '../../events/publishers/PaymentCreatedPublisher';


export default async (
  req: Request, 
  res: Response, 
  next: NextFunction
  ) => {
  const { orderId, token } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError()
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UserNotAuthorized()
  }
  if (order.status === OrderStatus.Cancelled) {
    throw new BadRequestError('Cannot pay for a cancelled order');
  }

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token
  });

  // Save payment
  const payment = Payment.build({
    order,
    stripeId: charge.id
  });
  await payment.save();

  new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    stripeId: payment.stripeId,
    order: {
      id: payment.order.id,
      userId: payment.order.userId,
      price: payment.order.price
    }
  });

  res.status(201).send({ success: true });
}