import express, { json, Router } from "express";
import {PrismaClient} from "./generated/prisma/index.js";
import { restaurantRouter } from "./controller/restaurant-controll.js";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import swaggerSpec from "./swagger.js";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3300;

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
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Felhasználó regisztráció
 *     description: Új felhasználó létrehozása és JWT token visszaadása
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Teszt Elek
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teszt@pelda.hu
 *               phone:
 *                 type: string
 *                 example: "+36301234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Titkos6jelszo!
 *     responses:
 *       201:
 *         description: Sikeres regisztráció
 *       400:
 *         description: Hiányzó kötelező mezők
 *       409:
 *         description: Email már létezik
 *       500:
 *         description: Szerver hiba
 */

// Regisztráció
app.post("/register", async (req,res) => {
  const { name, email,phone, password } = req.body;

  if (!name || !email || !password) {
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Felhasználó bejelentkezés
 *     description: Email és jelszó alapján JWT token visszaadása
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: teszt@pelda.hu
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Titkos6jelszo!
 *     responses:
 *       200:
 *         description: Sikeres bejelentkezés
 *       401:
 *         description: Hibás email vagy jelszó
 *       500:
 *         description: Szerver hiba
 */

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

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Felhasználók listázása
 *     description: Az összes felhasználó lekérése jelszó nélkül
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Felhasználók sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Teszt Elek
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: teszt@pelda.hu
 *                   phone:
 *                     type: string
 *                     example: "+36301234567"
 *                   role:
 *                     type: string
 *                     example: USER
 *       409:
 *         description: Email már létezik
 *       500:
 *         description: Szerver hiba
 */

//Felhasználók lekérése - csak adminoknak app.get("/user", authenticate, isAdmin, async (req, res)
app.get("/user", async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: { id: true, name: true, email: true, phone: true, role: true },
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

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Saját felhasználói adatok lekérése
 *     description: Visszaadja a bejelentkezett felhasználó adatait. JWT token szükséges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # JWT token szükséges
 *     responses:
 *       200:
 *         description: Felhasználó sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Teszt Elek
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: teszt@pelda.hu
 *                 phone:
 *                   type: string
 *                   example: "+36301234567"
 *                 role:
 *                   type: string
 *                   example: USER
 *       404:
 *         description: Felhasználó nem található
 *       500:
 *         description: Szerver hiba
 */

// Saját profil
app.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, role: true, phone:true, password:true },
    })
    if (!user) return res.status(404).json({ error: "Felhasználó nem található" })
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Szerver hiba" })
  }
})

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Saját felhasználói adatok lekérése
 *     description: Visszaadja a bejelentkezett felhasználó adatait. JWT token szükséges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # JWT token szükséges
 *     responses:
 *       200:
 *         description: Felhasználó sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Teszt Elek
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: teszt@pelda.hu
 *                 phone:
 *                   type: string
 *                   example: "+36301234567"
 *                 role:
 *                   type: string
 *                   example: USER
 *       400:
 *         description: Felhasználó nem található vagy nem sikerült frissíteni
 */

// Felhasználó nevének, telefonszámának, email címének módosítása
app.put("/users/:id", authenticate, async (req, res) => {
  const  id  = Number(req.params.id)
  const { name, email, phone, role } = req.body

   if (!name) return res.status(400).json({ error: "Név megadása kötelező" });

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { name,email,phone,role }
    })
    res.json(user)
  } catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült frissíteni" })
  }
})

/**
 * @swagger
 * /password/{id}:
 *   put:
 *     summary: Felhasználó jelszavának módosítása
 *     description: Régi jelszó ellenőrzése után frissíti a felhasználó jelszavát. JWT token szükséges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # JWT szükséges
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: A felhasználó ID-ja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: regiJelszo123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: ujJelszo456
 *     responses:
 *       200:
 *         description: Sikeres jelszófrissítés
 *       400:
 *         description: Hibás régi jelszó vagy frissítés sikertelen
 *       401:
 *         description: Token hiányzik vagy érvénytelen
 *       404:
 *         description: Felhasználó nem található
 */

app.put("/password/:id", authenticate, async (req, res) => {
  const  id  = Number(req.params.id)
  const  {oldPassword, newPassword}  = req.body

  try {
       const user = await prisma.users.findUnique({
      where: { id },
    })

    if (!user) {
      return res.status(404).json({ error: "Felhasználó nem található" })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password) // régi jelszó ellenőrzés

    if (!isMatch) {
      return res.status(400).json({ error: "A jelenlegi jelszó nem megfelelő" })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.users.update({     
      data: { password: hashedPassword },
      where: { id: Number(id) },
    });
    res.json({ success: true })
  } catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült frissíteni" })
  }
})

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Felhasználó törlése
 *     description: Törli a megadott ID-jú felhasználót. JWT token szükséges.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []  # JWT szükséges
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő felhasználó ID-ja
 *     responses:
 *       200:
 *         description: Felhasználó sikeresen törölve
 *       400:
 *         description: Felhasználó nem található vagy törlés sikertelen
 */

//Felhasználó törlése
app.delete("/user/:id", authenticate, async (req,res) => {
  const id  = req.params.id
  try {
    await prisma.users.delete({ where: { id: parseInt(id) } })
    res.json({ message: "Felhasználó törölve" })
  } catch (e) {
    res.status(400).json({ error: "Felhasználó nem található vagy nem sikerült törölni" })
  }
});

/**
 * @swagger
 * /tablestatus:
 *   get:
 *     summary: Asztalok foglaltsági státusza
 *     description: Visszaadja az összes asztalt és a hozzájuk tartozó foglalásokat. Lehetőség van egy konkrét időpontra (`at`) vagy időtartományra (`start` és `end`) szűrni.
 *     tags:
 *       - Tables
 *     parameters:
 *       - in: query
 *         name: at
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Egy konkrét időpont a státusz lekéréséhez (ISO formátum)
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Tartomány kezdete (ISO formátum)
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Tartomány vége (ISO formátum)
 *     responses:
 *       200:
 *         description: Asztalok és foglalások sikeresen lekérve
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   number:
 *                     type: integer
 *                     example: 5
 *                   seats:
 *                     type: integer
 *                     example: 4
 *                   reservation:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 101
 *                         dtime_from:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-01-05T18:00:00Z"
 *                         dtime_to:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-01-05T20:00:00Z"
 *                         reservation_status:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             status:
 *                               type: string
 *                               example: "confirmed"
 *       500:
 *         description: Hiba a lekérés során
 */

//Asztal státusz ellenörzés
app.get("/tablestatus", async (req, res) => {
  try {
    const { at, start, end } = req.query;
    
    let target;
    if (start && end) {
      // ÚJ: teljes tartomány!
      target = { start: new Date(start), end: new Date(end) };
    } else if (at) {
      // Régi fallback
      target = new Date(at);
    } else {
      target = new Date();
    }

    const data = await prisma.tables.findMany({
      include: {
        reservation: {
          where: start && end 
            ? {
                OR: [
                  { dtime_from: { lte: new Date(start) }, dtime_to: { gt: new Date(start) } },
                  { dtime_from: { lte: new Date(end) }, dtime_to: { gt: new Date(end) } },
                  { dtime_to: { gt: new Date(start) }, dtime_from: { lt: new Date(end) } }
                ]
              }
            : {
                dtime_from: { lte: target },
                dtime_to: { gt: target }
              },
          include: { reservation_status: true }
        }
      }
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a tablestatus lekérésénél" });
  }
});