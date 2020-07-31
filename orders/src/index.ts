import { TicketCreatedListener } from './events/listeners/TicketCreatedListener';
import { TicketUpdatedListener } from './events/listeners/TicketUpdatedListener';
import { ExpirationCompleteListener } from './events/listeners/ExpirationCompleteListener';
import { PaymentCreatedListener } from './events/listeners/PaymentCreatedListener';
import { natsWrapper } from './nats-wrapper';
import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }

  if (!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined!');
  }

  if (!process.env.NATS_CLUSTER_ID){
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }

  if (!process.env.NATS_URL){
    throw new Error('NATS_URL must be defined!');
  }

  if (!process.env.NATS_CLIENT_ID){
    throw new Error('NATS_CLIENT_ID must be defined!');
  }

  try {
    // Connect to NATS service Start
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID, 
      process.env.NATS_URL,
    );
    // Exit and close NATS Listener Start
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    // Exit and close NATS Listener End
    

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    // Connect to NATS service End
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log("Connected to mongoDB.");

  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Orders-service:3000");
  });
};

start();