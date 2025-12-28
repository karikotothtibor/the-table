import express, { json, Router } from "express";
import {PrismaClient} from "./generated/prisma/index.js";
import { restaurantRouter } from "./controller/restaurant-controll.js";
import cors from "cors";


const app = express();
const port = 3300;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


app.use(express.json());

const prisma = new PrismaClient();

const corsOption = {
    origin: "http://localhost:5173",
    methods : "GET,POST,PUT,DELETE",
    alloweeHeaders : "Content-type : application/json, Authorization",
    optionSuccesStatus: 200,
    credentials: true
}

app.use(cors(corsOption));
app.use(restaurantRouter);

app.listen(port,()=>{
    console.log("A szerver elindult a 3300-as porton.");
});

// JWT token generálása
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h"}
  );
}

// Middleware: Auth
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Hiányzó token" });

  const token = authHeader.split(" ")[1]; //Bearer TOKEN
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.id   // JWT-ben id van
    req.userRole = payload.role // JWT-ben role van
    next()
  } catch (e) {
    res.status(401).json({ error: "Érvénytelen token" })
  }
}

// Middleware: Admin ellenőrzés
/*function isAdmin(req, res, next) {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Nincs jogosultság" })
  }
  next()
}*/

// Regisztráció
app.post("/register", async (req,res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: "Név, email megadása kötelező"});
  }

  try {
  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.users.create({
    data: { name, email, phone, password: hashedPassword, role: "USER" }, // Átállítani ADMIN vagy USER
  })
  const token = generateToken(newUser)
  res.status(201).json({ token })
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Ez az email már létezik!" });
    }
    res.status(500).json({ error: "Szerver hiba!" })
  }
})

// Bejelentkezés
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: "Hibás adatok!" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: "Hibás adatok! "})

    const token = generateToken(user)
    res.json({ token })
    console.log("Bejelentkezve!")
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Szerver hiba" })
  }
})

//Felhasználók lekérése - csak adminoknak
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true },
        // jelszót ne küldjünk vissza 
    });
    res.json(users);
  } catch (error) {
    console.error(error);

    // Ha például az email már létezik
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Saját profil
app.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, role: true, phone: true, password: true },
    })
    if (!user) return res.status(404).json({ error: "Felhasználó nem található" })
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Szerver hiba" })
  }
})

// Felhasználó nevének módosítása
app.put("/users/:id", authenticate, async (req, res) => {
  const { id } = Number(req.params.id)
  const { name, email, phone, role } = req.body

   if (!name) return res.status(400).json({ error: "Név megadása kötelező" });

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { name, email, phone, role }
    })
    res.json(user)
  } catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült frissíteni" })
  }
})

//Jelszómódosítás
app.put("/password/:id", authenticate, async (req, res) => {
  const id = Number(req.params.id)
  const {oldPassword, newPassword} = req.body

  try {
    const user = await prisma.users.findUnique({
    where: {id}
    })

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található"})
    }

  const isMatch = await bcrypt.compare(oldPassword, user.password) //régi jelszó ellenőrzés

  if (!isMatch) {
    return res.status(400).json({ error: "A jelenlegi jelszó nem megfelelő"})
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.users.update({
    data: { password: hashedPassword },
    where: { id: Number(id)},
  });

  res.json({ success: true })
} catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült frissíteni "})
  }
})

//Felhasználó törlése
app.delete("/user/:id", authenticate, async (req,res) => {
  const { id} = req.params
  try {
    await prisma.users.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Felhasználó törölve" })
  } catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült törölni" })
  }
})

//Foglaláslekérdezés
app.get("/tablestatus", async (req, res) => {
  try {

    const at = req.query.at;
    const target = at ? new Date(at) : new Date();

    const data = await prisma.tables.findMany({
      include: {
        reservation: {
          where: {
            dtime_from: { lte: target },
            dtime_to: {gt: target}
          },
          include: { reservation_status: true }
        }
      }
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a tablestatus lekérdezésénél "})
  }
})
