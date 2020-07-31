import request from "supertest";
import { app } from "../../app";

it('return route not found', async () => {
    await request(app)
      .post('/api/orders/notfound')
      .send()
      .expect(404);
});