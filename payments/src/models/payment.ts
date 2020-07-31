import { OrderDoc } from './order';
import mongoose from 'mongoose';

interface PaymentAttrs {
  order: OrderDoc;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  order: OrderDoc;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc>{
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  stripeId: {
    type: String,
    required: true
  }
},{
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };