import { PrismaClient } from "/generated/prisma/index.js";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

test("Prisma users.create works with hashed password", async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const data = await prisma.users.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      phone: "06123456789",
      password: hashedPassword,
      role: "USER",
    },
  });

  expect(data.id).toBeDefined();
  expect(data.email).toBe("test@example.com");
  expect(data.phone).toBe("06123456789");
  expect(data.role).toBe("USER");
  expect(await bcrypt.compare("password123", data.password)).toBe(true);
}, 15000);

afterEach(async () => {
  await prisma.users.deleteMany({ where: { email: "test@example.com" } });
});

afterAll(async () => {
  await prisma.$disconnect();
});
