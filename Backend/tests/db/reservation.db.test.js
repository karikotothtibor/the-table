import { PrismaClient } from "/generated/prisma/index.js";
const prisma = new PrismaClient();

beforeEach(async () => {  // 👈 IDE!
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


test("Should Add Reservation", async () => {
  const data = await prisma.reservation.create({
    data: {
      user_id: 1,      // létező user ID
      status_id: 1,    // pending
      table_id: 1,     // létező asztal
      dtime_from: new Date("2026-01-11T18:00:00"),
      dtime_to: new Date("2026-01-11T20:00:00"),
      number_of_customers: 4,
      guest_name: "Teszt Vendég"
    },
  });

  expect(data).toHaveProperty("id");
  expect(data.number_of_customers).toBe(4);
});

afterEach(async () => {
  await prisma.reservation.deleteMany({
    where: {
       user_id: 1,  // vagy user_id: 1
    },
  });
});
