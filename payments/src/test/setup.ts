import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global{
      signin(id?: string): string[];
    }
  }
}

jest.mock("../nats-wrapper");

jest.setTimeout(30000);

let mongo: any;

process.env.STRIPE_KEY = 'sk_test_QIe47jkx8KrFNodsGClfXDS2';

beforeAll( async () => {
  process.env.JWT_KEY = "hellohdhjsn";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});


beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT Payload {id, email};
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. {jwt: MY_JWT}
  const session = {jwt: token}

  // Turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that's the cookie with the encoded data
  return [`express:sess=${base64}`];
}