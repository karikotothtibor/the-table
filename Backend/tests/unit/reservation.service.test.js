
import { reservationAdd } from "/service/restaurant-service.js";
import { PrismaClient } from "/generated/prisma/index.js";

const prisma = new PrismaClient();

test("reservationAdd service should Add the Reservation", async () => {
  const data = await reservationAdd(1, 1, 1, "2026-01-11T18:00", "2026-01-11T20:00", 4,"Teszt Vendég");

  expect(data.message).toBe("Sikeresen létrehozva!");
});

afterEach(async () => {
  await prisma.reservation.deleteMany({
    where: {
      guest_name: "Teszt Vendég",
    },
  });
});
