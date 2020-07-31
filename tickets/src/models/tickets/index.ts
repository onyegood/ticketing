import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// An inerface that describes the properties 
// that are required to create new ticket
interface TicketAttr {
  title: string;
  price: number;
  userId: string;
}

// An interface that describes the properties
// the Ticket model has
interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAttr): TicketDocument;
}

// An interface that describes the properties
// that a Ticket document has
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  userId: {
    type: String,
    required: true
  },
  orderId: {
    type: String
  }
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret){
      ret.id = ret._id;
      delete ret._id;
    }
  } 
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttr) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);

export { Ticket };