// tests/integration/tablestatus.integration.test.js
import request from 'supertest';
import app from '/index.js';
import { PrismaClient } from '/generated/prisma/index.js';

const prisma = new PrismaClient();

let table;

beforeEach(async () => {
  table = await prisma.tables.create({
    data: { capacity: 4 }  
  });

  await prisma.reservation.create({
    data: {
      users: { connect: { id: 1 } },
      tables: { connect: { id: table.id} },
      reservation_status: { connect: { id: 1 } },
      dtime_from: new Date('2026-01-14T18:00:00'),
      dtime_to: new Date('2026-01-14T20:00:00'),
      number_of_customers: 4,
      guest_name: 'Int Test'
    }
  });
});

test('GET /tablestatus pontos időpont', async () => {
  const at = '2026-01-14T18:00:00.000Z';
  const response = await request(app)
    .get(`/tablestatus?at=${encodeURIComponent(at)}`)
    .expect(200);

  //expect(Array.isArray(response.body)).toBe(true);
  //expect(response.body.length).toBeGreaterThan(0);
  
  const row = response.body.find(t => t.id === table.id);
  console.log(JSON.stringify(row, null, 2));
  expect(row).toBeDefined();
  expect(Array.isArray(row.reservation)).toBe(true);
  expect(row.reservation).toHaveLength(1);
});

test('GET /tablestatus tartomány', async () => {
  const start = '2026-01-14T17:00:00.000Z';
  const end   = '2026-01-14T21:00:00.000Z';
  const response = await request(app)
    .get(`/tablestatus?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
    .expect(200);

  const row = response.body.find(t => t.id === table.id);
  expect(row).toBeDefined();
  expect(row.reservation).toHaveLength(1);
  expect(row.reservation[0].guest_name).toBe('Int Test');
});

test('GET /tablestatus most', async () => {
  const response = await request(app)
    .get('/tablestatus')
    .expect(200);

  expect(Array.isArray(response.body)).toBe(true);
});

afterEach(async () => {
  await prisma.reservation.deleteMany({
    where: { table_id: table.id },
  });
  await prisma.tables.deleteMany({
    where: { id: table.id },
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
