import { app } from "./app";
import mongoose from "mongoose";


const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined!");
  }
  if (!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined!');
  }

  try {
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
    console.log("auth-service:3000");
  });
};

start();