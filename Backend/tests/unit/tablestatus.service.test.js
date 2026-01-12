import { PrismaClient } from '/generated/prisma/index.js';

const prisma = new PrismaClient();

let table;

test('tablestatus logika', async () => {
    table = await prisma.tables.create({
    data: { capacity: 8 }  // Schema szerint
  });

  await prisma.reservation.create({
    data: {
      users: { connect: { id: 1 } },
      tables: { connect: { id: table.id } },
      reservation_status: { connect: { id: 1 } },
      dtime_from: new Date('2026-01-13T18:00:00'),
      dtime_to: new Date('2026-01-13T20:00:00'),
      number_of_customers: 6,
      guest_name: 'Unit Test'
    }
  });

  const req = { query: { at: '2026-01-13T19:00:00Z' } };
  
  const data = await prisma.tables.findMany({
  include: {
    reservation: {
      where: {
        dtime_from: { lte: new Date(req.query.at) },
        dtime_to:   { gte: new Date(req.query.at) },
      },
    },
  },
});

const row = data.find(t => t.id === table.id);
expect(row).toBeDefined();
expect(row.reservation.length).toBe(1);

await prisma.reservation.deleteMany({
    where: { guest_name: 'Unit Test' },
  });
  await prisma.tables.deleteMany({
    where: { id: table.id },
  });
});
