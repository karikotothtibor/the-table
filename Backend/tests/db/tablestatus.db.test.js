// tests/db/tablestatus.db.test.js
import { PrismaClient } from '/generated/prisma/index.js';

const prisma = new PrismaClient();

let table;

test('prisma.tables.findMany foglalásokkal', async () => {
  // Teszt adatok
  table = await prisma.tables.create({
    data: { capacity: 6 } 
  });

  await prisma.reservation.create({
    data: {
      users: { connect: { id: 1 } },
      tables: { connect: { id: table.id } },
      reservation_status: { connect: { id: 1 } },
      dtime_from: new Date('2026-01-12T18:00:00'),
      dtime_to: new Date('2026-01-12T20:00:00'),
      number_of_customers: 4,
      guest_name: 'DB Test'
    }
  });

  // Pontos időpont lekérdezés
  const data = await prisma.tables.findMany({
    include: {
      reservation: {
        where: {
          dtime_from: { lte: new Date('2026-01-12T19:00:00') },
          dtime_to: { gt: new Date('2026-01-12T19:00:00') }
        },
      }
    }
  });

  const testTable = data.find(t => t.id === table.id);
  expect(testTable.reservation.length).toBe(1);
});

afterEach(async () => {
  await prisma.reservation.deleteMany({where: {
      table_id: table.id,                         
    },});
  await prisma.tables.deleteMany({
    where: {
      id: table.id,                  
    },
  });
});
