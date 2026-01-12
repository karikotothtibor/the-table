// tests/integration/reservation.integration.test.js
import request from 'supertest';
import app from '/index.js'; // Fő appod
import { PrismaClient } from '/generated/prisma/index.js';

const prisma = new PrismaClient();

beforeEach(async () => { 
  // Létrehoz teszt adatokat
  await prisma.users.upsert({
    where: { id: 1 },
    update: { },
    create: { 
      id: 1, name: 'Test User', email: 'test@example.com', 
      phone: '123456', password: 'hash', role: 'USER' 
    }
  });

  await prisma.tables.upsert({
    where: { id: 1 },
    update: { },
    create: { id: 1, capacity: 4 }
  });

  await prisma.reservation_status.upsert({
    where: { id: 1 },
    update: { },
    create: { id: 1 ,status: "foglalt"}
  });
});

test('POST /reservation létrehoz foglalást', async () => {
  const response = await request(app)
    .post('/reservation') // Útvonalad szerint
    .send({ 
      user_id: 1,
      status_id: 1,
      table_id: 1,
      dtime_from: '2026-01-18T18:00:00',
      dtime_to: '2026-01-18T20:00:00',
      number_of_customers: 4,
      guest_name: 'Teszt Vendég'
    })
    .expect(201);

  expect(response.body.message).toBe('Sikeresen létrehozva!');
});

test('POST /reservation validációs hiba', async () => {
  const response = await request(app)
    .post('/reservation')
    .send({ 
      user_id: 1,
        status_id: 1,
      table_id: 999, // Nem létező asztal
      dtime_from: '2026-01-18T18:00',
      dtime_to: '2026-01-18T20:00',
      number_of_customers: 4,
      guest_name: 'Teszt'
    })
    .expect(400); 

  expect(response.body.error).toBe('Asztal nem található!');
});

afterEach(async () => {
  await prisma.reservation.deleteMany({
    where: {
      guest_name: 'Teszt',
    }
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
