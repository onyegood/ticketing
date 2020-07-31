import request from "supertest";
import { app } from "../../app";

it('return a 201 status code on successful sign up', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);
});

it('return a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test",
      password: "password"
    })
    .expect(400)
});

it('return a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "p"
    })
    .expect(400)
});

it('return a 400 with missing email and password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({})
      .expect(400)
});

it('disallow duplicate emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "password"
      })
      .expect(201)
      
    await request(app)
      .post('/api/users/signup')
      .send({
        email: "test@test.com",
        password: "password"
      })
      .expect(400)
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});