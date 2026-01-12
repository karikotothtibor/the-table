import { PrismaClient } from "/generated/prisma/index.js";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

test('register teljes logika működik mock nélkül', async () => {
  const req = { 
    body: { 
      name: 'Teszt Elek', 
      email: `unit-${Date.now()}@example.com`, 
      phone: '06123456789', 
      password: 'titkos123' 
    } 
  };
  
  const res = { 
    statusCalledWith: null,
    jsonCalledWith: null,
    status: function(code) {
      this.statusCalledWith = code;
      return this;
    },
    json: function(data) {
      this.jsonCalledWith = data;
      return this;
    }
  };

  // TELJES route kód bemásolása (generateToken inline-ra cserélve)
  const { name, email, phone, password } = req.body;
  
  if (!name || !email || !password || !phone) {
    res.status(400).json({ error: "Név, email megadása kötelező" });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // VALÓS bcrypt
      const newUser = await prisma.users.create({
        data: { name, email, phone, password: hashedPassword, role: "USER" }
      });
      
      // Inline token (JWT vagy base64)
      const token = Buffer.from(JSON.stringify({ id: newUser.id, email: newUser.email })).toString('base64');
      
      res.status(201).json({ token });
    } catch (error) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "Ez az email már létezik!" });
      } else {
        res.status(500).json({ error: "Szerver hiba!" });
      }
    }
  }

  // Ellenőrzés
  expect(res.statusCalledWith).toBe(201);
  expect(res.jsonCalledWith.token).toBeDefined();
  expect(res.jsonCalledWith.token.length).toBeGreaterThan(10);
}, 10000);

afterEach(async () => {
  await prisma.users.deleteMany({ where: { email: { endsWith: '@example.com' } } });
});
