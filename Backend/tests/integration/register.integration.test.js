import request from 'supertest';
import app from '/index'; // app.use(router)
import { PrismaClient } from "/generated/prisma/index.js";

const prisma = new PrismaClient();

test("POST /register creates user", async () => {
  const response = await request(app)
    .post('/register')
    .send({ 
      name: "Test User", 
      email: `test-${Date.now()}@example.com`,
      phone: "06123456789",
      password: "password123" 
    });

  expect(response.status).toBe(201);
  expect(response.body.token).toBeDefined();
});

test("POST /register duplicate email returns 409", async () => {
  const testEmail = `dup-${Date.now()}@example.com`;
  await request(app).post('/register').send({ name: "Dup", email: testEmail,phone: "06123456789", password: "pass" });
  
  const response = await request(app)
    .post('/register')
    .send({ name: "Dup2", email: testEmail,phone: "06123456789" ,password: "pass" });

  expect(response.status).toBe(409);
  expect(response.body.error).toBe("Ez az email már létezik!");
});

afterEach(async () => {
  await prisma.users.deleteMany({ where: { email: { endsWith: '@example.com' } } });
});
