import request from "supertest";
import { app } from "../../app";

it('fail and return a 400 status code when an email that does not exist is used to log in.', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(400);
});

it('fail and return 400 status code when an incorrect password is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "test@test.com",
    password: "password"
  })
  .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password123"
    })
    .expect(400);
});

it('fail and return 400 status code when an incorrect email is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "test@test.com",
    password: "password"
  })
  .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: "hhdjddkdkd",
      password: "password"
    })
    .expect(400);
});

it('fail and return 500 status code when no email and password are supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "test@test.com",
    password: "password"
  })
  .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({})
    .expect(400);
});

it('return 200 status code and a cookie when given correct credentials is supplied', async () => {
  await request(app)
  .post('/api/users/signup')
  .send({
    email: "test@test.com",
    password: "password"
  })
  .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});