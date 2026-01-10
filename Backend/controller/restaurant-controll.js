
import express from "express";
import { reviewsList,
    reviewsAdd,
    reviewsUpdate,
    //UserAdd,
    //UserList, 
    //UserDelete, 
    //UserUpdate, 
    reviewLogoutList, 
    reviewLogoutAdd,
    reviewLogoutUpdate,
    deleteReviewById, 
    reservationList, 
    reservationAdd, 
    reservationDelete, 
    reservationUpdate,
    notificationAdd,
    notificationDelete,
    notificationList,
    notificationUpdate,
    openningHourAdd,
    openningHourDelete,
    openningHourList,
    openningHourUpdate,
    statusAdd,
    statusDelete,
    statusList,
    statusUpdate,
    tableAdd,
    tableDelete,
    tableList,
    tableUpdate,
    checkEmail} from "../service/restaurant-service.js";

const router = express.Router();


// user tábla---------------------------------------------------------------

/*router.get ("/user",async (req, res) => {
    try {
       const data = await UserList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});*/

/*router.post ("/useradd", async (req, res) => {
    const {name, email, phone, password} = req.body;
    try {
        const data = await UserAdd(name, email, phone, password);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});*/

/*router.delete("/user/:id", async (req, res) => {
    const user_id = req.params.id
    try {
        const data = await UserDelete(user_id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

router.put("/user", async (req, res) => {
    const {id, name, email, phone, password} = req.body;
    try {
        const data = await UserUpdate(id, name, phone, email, password);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});*/
//reservation tábla---------------------------------------------------------
/**
 * @swagger
 * /reservation:
 *   get:
 *     summary: Foglalások listázása
 *     description: Visszaadja az összes foglalást a rendszerben.
 *     tags:
 *       - Reservations
 *     responses:
 *       200:
 *         description: "Foglalások sikeresen lekérve"
 *                 
 *       400:
 *         description: Hiba a lekérés során
 */

router.get ("/reservation",async (req, res) => {
    try {
       const data = await reservationList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /reservation:
 *   post:
 *     summary: Új foglalás létrehozása
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers]
 *             properties:
 *               user_id: { type: integer, example: 1 }
 *               status_id: { type: integer, example: 1 }
 *               table_id: { type: integer, example: 5 }
 *               dtime_from: { type: string, format: date-time, example: "2026-01-05T18:00:00Z" }
 *               dtime_to: { type: string, format: date-time, example: "2026-01-05T20:00:00Z" }
 *               number_of_customers: { type: integer, example: 4 }
 *               guest_name: { type: string, example: "Kiss János" }
 *     responses:
 *       201:
 *         description: Sikeres létrehozás
 *       400:
 *         description: Hibás adatok
 */

router.post ("/reservation", async (req, res) => {
    const {user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers,guest_name} = req.body;
    try {
        const data = await reservationAdd(user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers,guest_name);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

/**
 * @swagger
 * /reservation/{id}:
 *   delete:
 *     summary: Foglalás törlése
 *     description: Törli a megadott ID-jú foglalást a rendszerből.
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő foglalás ID-ja
 *     responses:
 *       200:
 *         description: Foglalás sikeresen törölve
 *       400:
 *         description: Hibás foglalás ID vagy törlés sikertelen
 */

router.delete("/reservation/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await reservationDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /reservation:
 *   put:
 *     summary: Foglalás módosítása
 *     description: Frissíti a megadott ID-jú foglalás adatait (időpont és vendégek száma).
 *     tags:
 *       - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - dtime_from
 *               - dtime_to
 *               - number_of_customers
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 101
 *                 description: A módosítandó foglalás ID-ja
 *               dtime_from:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-05T18:00:00Z"
 *               dtime_to:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-05T20:00:00Z"
 *               number_of_customers:
 *                 type: integer
 *                 example: 4
 *                 description: Vendégek száma
 *     responses:
 *       200:
 *         description: Foglalás sikeresen frissítve
 *       400:
 *         description: Hibás adatok vagy a foglalás nem frissíthető
 */

router.put("/reservation", async (req, res) => {
    const {id, dtime_from, dtime_to, number_of_customers} = req.body;
    try {
        const data = await reservationUpdate(id, dtime_from, dtime_to, number_of_customersd);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//table tábla---------------------------------------------------------------

/**
 * @swagger
 * /table:
 *   get:
 *     summary: Asztalok listázása
 *     description: Visszaadja az összes asztalt a rendszerben.
 *     tags:
 *       - Tables
 *     responses:
 *       200:
 *         description: Asztalok sikeresen lekérve
 *       400:
 *         description: Hiba az asztalok lekérése során
 */

router.get ("/table",async (req, res) => {
    try {
       const data = await tableList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /table:
 *   post:
 *     summary: Új asztal hozzáadása
 *     description: Létrehoz egy új asztalt a megadott kapacitással.
 *     tags:
 *       - Tables
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - capacity
 *             properties:
 *               capacity:
 *                 type: integer
 *                 example: 4
 *                 description: Az asztal férőhelyeinek száma
 *     responses:
 *       201:
 *         description: Asztal sikeresen létrehozva
 *       400:
 *         description: Hibás adatok vagy az asztal létrehozása sikertelen
 */

router.post ("/table", async (req, res) => {
    const {capacity} = req.body;
    try {
        const data = await tableAdd(capacity);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

/**
 * @swagger
 * /table/{id}:
 *   delete:
 *     summary: Asztal törlése
 *     description: Törli a megadott ID-jú asztalt a rendszerből.
 *     tags:
 *       - Tables
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő asztal ID-ja
 *     responses:
 *       200:
 *         description: Asztal sikeresen törölve
 *       400:
 *         description: Hibás asztal ID vagy törlés sikertelen
 */

router.delete("/table/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await tableDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /table:
 *   put:
 *     summary: Asztal módosítása
 *     description: Frissíti a megadott ID-jú asztal kapacitását.
 *     tags:
 *       - Tables
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - capacity
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A módosítandó asztal ID-ja
 *               capacity:
 *                 type: integer
 *                 example: 6
 *                 description: Az új kapacitás
 *     responses:
 *       200:
 *         description: Asztal sikeresen frissítve
 *       400:
 *         description: Hibás adatok vagy az asztal nem frissíthető
 */

router.put("/table", async (req, res) => {
    const {id, capacity} = req.body;
    try {
        const data = await tableUpdate(id, capacity);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//status tábla--------------------------------------------------------------

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Státuszok listázása
 *     description: Visszaadja az összes elérhető foglalási státuszt a rendszerben.
 *     tags:
 *       - Status
 *     responses:
 *       200:
 *         description: Státuszok sikeresen lekérve
 *       400:
 *         description: Hiba a státuszok lekérése során
 */

router.get ("/status",async (req, res) => {
    try {
       const data = await statusList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /status:
 *   post:
 *     summary: Új státusz hozzáadása
 *     description: Létrehoz egy új foglalási státuszt a megadott névvel.
 *     tags:
 *       - Status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "foglalt"
 *                 description: A létrehozandó státusz neve
 *     responses:
 *       201:
 *         description: Státusz sikeresen létrehozva
 *       400:
 *         description: Hibás adatok vagy a státusz létrehozása sikertelen
 */

router.post ("/status", async (req, res) => {
    const {status} = req.body;
    try {
        const data = await statusAdd(status);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

/**
 * @swagger
 * /status/{id}:
 *   delete:
 *     summary: Státusz törlése
 *     description: Törli a megadott ID-jú foglalási státuszt a rendszerből.
 *     tags:
 *       - Status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő státusz ID-ja
 *     responses:
 *       200:
 *         description: Státusz sikeresen törölve
 *       400:
 *         description: Hibás státusz ID vagy törlés sikertelen
 */

router.delete("/status/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await statusDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /status:
 *   put:
 *     summary: Státusz módosítása
 *     description: Frissíti a megadott ID-jú foglalási státusz nevét.
 *     tags:
 *       - Status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A módosítandó státusz ID-ja
 *               status:
 *                 type: string
 *                 example: "szabad"
 *                 description: Az új státusz neve
 *     responses:
 *       200:
 *         description: Státusz sikeresen frissítve
 *       400:
 *         description: Hibás adatok vagy a státusz nem frissíthető
 */

router.put("/status", async (req, res) => {
    const {id, status} = req.body;
    try {
        const data = await statusUpdate(id, status);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//notification tábla--------------------------------------------------------

/**
 * @swagger
 * /notification:
 *   get:
 *     summary: Értesítések listázása
 *     description: Visszaadja az összes értesítést a rendszerből.
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: Értesítések sikeresen lekérve
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
 *                   user_id:
 *                     type: integer
 *                     example: 101
 *                   message:
 *                     type: string
 *                     example: "Foglalás megerősítve"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-05T12:00:00Z"
 *       400:
 *         description: Hiba az értesítések lekérése során
 */

router.get ("/notification",async (req, res) => {
    try {
       const data = await notificationList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /notification:
 *   post:
 *     summary: Új értesítés létrehozása
 *     description: Létrehoz egy új értesítést a megadott adatokkal.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - status
 *               - user_id
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Foglalás megerősítve"
 *                 description: Az értesítés szövege
 *               status:
 *                 type: string
 *                 example: "unread"
 *                 description: Az értesítés státusza
 *               user_id:
 *                 type: integer
 *                 example: 101
 *                 description: A címzett felhasználó ID-ja
 *               reservation_id:
 *                 type: integer
 *                 example: 10
 *                 description: A kapcsolódó foglalás ID-ja (opcionális)
 *               sender_id:
 *                 type: integer
 *                 example: 1
 *                 description: A feladó ID-ja (opcionális)
 *     responses:
 *       201:
 *         description: Értesítés sikeresen létrehozva
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 message:
 *                   type: string
 *                   example: "Foglalás megerősítve"
 *                 status:
 *                   type: string
 *                   example: "unread"
 *                 user_id:
 *                   type: integer
 *                   example: 101
 *                 reservation_id:
 *                   type: integer
 *                   example: 10
 *                 sender_id:
 *                   type: integer
 *                   example: 1
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-05T12:00:00Z"
 *       400:
 *         description: Hibás adatok vagy az értesítés létrehozása sikertelen
 */

router.post ("/notification", async (req, res) => {
    const {message,status,user_id,reservation_id,sender_id} = req.body;
    try {
        const data = await notificationAdd(message,status,user_id,reservation_id,sender_id);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

/**
 * @swagger
 * /notification/{id}:
 *   delete:
 *     summary: Értesítés törlése
 *     description: Törli a megadott ID-jú értesítést a rendszerből.
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő értesítés ID-ja
 *     responses:
 *       200:
 *         description: Értesítés sikeresen törölve
 *       400:
 *         description: Hibás értesítés ID vagy törlés sikertelen
 */

router.delete("/notification/:id", async (req, res) => {
    const id = Number(req.params.id)
    try {
        const data = await notificationDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /notification:
 *   put:
 *     summary: Értesítés frissítése
 *     description: Frissíti a megadott ID-jú értesítés szövegét és státuszát.
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - message
 *               - status
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A frissítendő értesítés ID-ja
 *               message:
 *                 type: string
 *                 example: "Foglalás megerősítve"
 *                 description: Az új értesítés szövege
 *               status:
 *                 type: string
 *                 example: "read"
 *                 description: Az értesítés új státusza
 *     responses:
 *       200:
 *         description: Értesítés sikeresen frissítve
 *       400:
 *         description: Hibás adatok vagy az értesítés nem frissíthető
 */

router.put("/notification", async (req, res) => {
    const {id,message,status} = req.body;
    try {
        const data = await notificationUpdate(id,message,status);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//rewievs tábla-------------------------------------------------------------

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Értékelések listázása
 *     description: Visszaadja az összes értékelést a rendszerből.
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: "Értékelések sikeresen lekérve"
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
 *                   user_id:
 *                     type: integer
 *                     example: 101
 *                   reservation_id:
 *                     type: integer
 *                     example: 10
 *                   rating:
 *                     type: integer
 *                     example: 5
 *                   comment:
 *                     type: string
 *                     example: "Nagyon jó étterem, szép környezet."
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-01-05T12:00:00Z"
 *       400:
 *         description: Hiba az értékelések lekérése során
 */

router.get("/review",async (req, res) => {
    try {
        const data = await reviewsList();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /review:
 *   post:
 *     summary: "Új értékelés létrehozása"
 *     description: Létrehoz egy új értékelést a megadott adatokkal.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *               - user_id
 *               - reservation_id
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *                 description: Az értékelés pontszáma (1-5)
 *               comment:
 *                 type: string
 *                 example: "Nagyon jó étterem, szép környezet."
 *                 description: Az értékelés szövege
 *               user_id:
 *                 type: integer
 *                 example: 101
 *                 description: Az értékelést készítő felhasználó ID-ja
 *               reservation_id:
 *                 type: integer
 *                 example: 10
 *                 description: A kapcsolódó foglalás ID-ja
 *     responses:
 *       201: 
 *          description: "Értékelés sikeresen létrehozva"
 *          content:    
 *            application/json:
 *              schema:
 *               type: "object"
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 comment:
 *                   type: string
 *                   example: "Nagyon jó étterem, szép környezet."
 *                 user_id:
 *                   type: integer
 *                   example: 101
 *                 reservation_id:
 *                   type: integer
 *                   example: 10
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-05T12:00:00Z"
 *       400:
 *         description: Hibás adatok vagy az értékelés létrehozása sikertelen
 */

router.post("/review",async (req, res) => {
    const {rating, comment, user_id, reservation_id } = req.body;
    try {
        const data = await reviewsAdd(rating, comment, user_id, reservation_id);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /review:
 *   put:
 *     summary: Értékelés frissítése
 *     description: Frissíti a megadott ID-jú értékelést.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - rating
 *               - comment
 *               - created_at
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A frissítendő értékelés ID-ja
 *               rating:
 *                 type: integer
 *                 example: 5
 *                 description: Az értékelés új pontszáma (1-5)
 *               comment:
 *                 type: string
 *                 example: "Nagyon jó étterem, szép környezet."
 *                 description: Az értékelés új szövege
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-05T12:00:00Z"
 *                 description: Az értékelés létrehozásának időpontja (opcionális, ha módosítani kell)
 *     responses:
 *       200:
 *         description: "Értékelés sikeresen frissítve"
 *       400:
 *         description: Hibás adatok vagy az értékelés nem frissíthető
 */

router.put("/review", async (req, res) => {
    const {id, rating, comment, created_at} = req.body;
    try {
        const data = await reviewsUpdate(id, rating, comment, created_at);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//openning hours tábla------------------------------------------------------

/**
 * @swagger
 * /openninghours:
 *   get:
 *     summary: Nyitvatartási adatok lekérése
 *     description: Visszaadja az összes nyitvatartási adatot a rendszerből.
 *     tags:
 *       - Openning Hours
 *     responses:
 *       200:
 *         description: Nyitvatartási adatok sikeresen lekérve
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
 *                   day_of_week:
 *                     type: string
 *                     example: "Hétfő"
 *                   open_time:
 *                     type: integer
 *                     example: 9
 *                     description: Nyitási óra (0-24)
 *                   close_time:
 *                     type: integer
 *                     example: 18
 *                     description: Zárási óra (0-24)
 *       400:
 *         description: Hiba a nyitvatartási adatok lekérése során
 */

router.get ("/openninghours",async (req, res) => {
    try {
       const data = await openningHourList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

/**
 * @swagger
 * /openninghours:
 *   post:
 *     summary: Új nyitvatartási adat hozzáadása
 *     description: Létrehoz egy új nyitvatartási sort a megadott naphoz és időkhöz.
 *     tags:
 *       - Openning Hours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - open_time
 *               - close_time
 *             properties:
 *               day_of_week:
 *                 type: string
 *                 example: "Hétfő"
 *                 description: A hét napja
 *               open_time:
 *                 type: integer
 *                 example: 9
 *                 description: Nyitási óra (0-24), 0 = zárva
 *               close_time:
 *                 type: integer
 *                 example: 18
 *                 description: Zárási óra (0-24), 0 = zárva
 *     responses:
 *       201:
 *         description: Nyitvatartási adat sikeresen létrehozva
 *       400:
 *         description: Hibás adatok vagy a nyitvatartás létrehozása sikertelen
 */

router.post ("/openninghours", async (req, res) => {
    const {day_of_week, open_time, close_time} = req.body;
    try {
        const data = await openningHourAdd(day_of_week, open_time, close_time);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

/**
 * @swagger
 * /openninghours/{id}:
 *   delete:
 *     summary: Nyitvatartási adat törlése
 *     description: Törli a megadott ID-jú nyitvatartási sort a rendszerből.
 *     tags:
 *       - Openning Hours
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő nyitvatartási adat ID-ja
 *     responses:
 *       200:
 *         description: Nyitvatartási adat sikeresen törölve
 *       400:
 *         description: Hibás ID vagy törlés sikertelen
 */

router.delete("/openninghours/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await openningHourDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /openninghours:
 *   put:
 *     summary: Nyitvatartási adat frissítése
 *     description: Frissíti a megadott ID-jú nyitvatartási sort.
 *     tags:
 *       - Openning Hours
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - day_of_week
 *               - open_time
 *               - close_time
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A frissítendő nyitvatartási adat ID-ja
 *               day_of_week:
 *                 type: string
 *                 example: "Hétfő"
 *                 description: A hét napja
 *               open_time:
 *                 type: integer
 *                 example: 9
 *                 description: Nyitási óra (0-24), 0 = zárva
 *               close_time:
 *                 type: integer
 *                 example: 18
 *                 description: Zárási óra (0-24), 0 = zárva
 *     responses:
 *       200:
 *         description: Nyitvatartási adat sikeresen frissítve
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 day_of_week:
 *                   type: string
 *                   example: "Hétfő"
 *                 open_time:
 *                   type: integer
 *                   example: 9
 *                 close_time:
 *                   type: integer
 *                   example: 18
 *       400:
 *         description: Hibás adatok vagy a nyitvatartás nem frissíthető
 */

router.put("/openninghours", async (req, res) => {
    const {id, day_of_week, open_time, close_time} = req.body;
    try {
        const data = await openningHourUpdate(id, day_of_week, open_time, close_time);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

//reviews logout tábla------------------------------------------------------

/**
 * @swagger
 * /reviewslogout:
 *   get:
 *     summary: Értékelések lekérése bejelentkezés nélkül
 *     description: Visszaadja az összes értékelést, amely a felhasználók számára bejelentkezés nélkül is látható.
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Értékelések sikeresen lekérve
 *       400:
 *         description: Hiba az értékelések lekérése során
 */

router.get("/reviewslogout", async (req, res) => {
    try {
        const data = await reviewLogoutList();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /reviewslogout:
 *   post:
 *     summary: Új értékelés hozzáadása bejelentkezés nélkül
 *     description: Lehetővé teszi, hogy egy látogató bejelentkezés nélkül értékelést küldjön az étteremhez.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - comment
 *               - rating
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Kiss Péter"
 *                 description: A látogató neve
 *               email:
 *                 type: string
 *                 example: "kiss.peter@email.com"
 *                 description: A látogató email címe
 *               comment:
 *                 type: string
 *                 example: "Nagyon jó étterem, szép környezet."
 *                 description: Az értékelés szövege
 *               rating:
 *                 type: integer
 *                 example: 5
 *                 description: Az értékelés pontszáma (1-5)
 *     responses:
 *       201:
 *         description: Értékelés sikeresen létrehozva
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
 *                   example: "Kiss Péter"
 *                 email:
 *                   type: string
 *                   example: "kiss.peter@email.com"
 *                 comment:
 *                   type: string
 *                   example: "Nagyon jó étterem, szép környezet."
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-01-05T12:00:00Z"
 *       400:
 *         description: Hibás adatok vagy az értékelés létrehozása sikertelen
 */

router.post("/reviewslogout", async (req, res) => {
    const {name, email, comment, rating } = req.body;
    try {
        const data = await reviewLogoutAdd(name, email, comment, rating);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Értékelés törlése
 *     description: Törli a megadott ID-jú értékelést a rendszerből.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő értékelés ID-ja
 *     responses:
 *       200:
 *         description: Értékelés sikeresen törölve
 *       400:
 *         description: Hiányzó id paraméter
 *       404:
 *         description: Értékelés nem található
 */

router.delete("/reviews/:id" , async(req, res) => {
    const { id } = req.params
  try {
    
    if (!id) {
      return res.status(400).json({ error: 'Hiányzó id paraméter.' })
    }

    const totalDeleted  = await deleteReviewById(id)

    if (totalDeleted === 0) {
      return res.status(404).json({ error: 'Review nem található.' })
    }

    return res.json({ ok: true, deleted: totalDeleted })
  } catch (err) {
    console.error('Hiba a reviewDelete-ben:', err)
    res.status(500).json({ error: 'Nem sikerült törölni a véleményt.' })
  }
});

/**
 * @swagger
 * /reviewslogout:
 *   put:
 *     summary: Publikus értékelés frissítése (bejelentkezés nélkül)
 *     description: Frissíti a megadott ID-jú publikus értékelést. Ezt a látogatók használhatják bejelentkezés nélkül.
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - email
 *               - comment
 *               - rating
 *               - created_at
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *                 description: A frissítendő értékelés ID-ja
 *               name:
 *                 type: string
 *                 example: "Kiss Péter"
 *                 description: A látogató neve
 *               email:
 *                 type: string
 *                 example: "kiss.peter@email.com"
 *                 description: A látogató email címe
 *               comment:
 *                 type: string
 *                 example: "Nagyon jó étterem, szép környezet."
 *                 description: Az értékelés szövege
 *               rating:
 *                 type: integer
 *                 example: 5
 *                 description: Az értékelés pontszáma (1-5)
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-05T12:00:00Z"
 *                 description: Értékelés létrehozásának ideje
 *     responses:
 *       200:
 *         description: Értékelés sikeresen frissítve
 *       400:
 *         description: Hibás adatok vagy az értékelés nem frissíthető
 */

router.put("/reviewslogout", async (req, res) => {
    const {id, name, email, comment, rating, created_at} = req.body;
    try {
        const data = await reviewLogoutUpdate(id, name, email, comment, rating, created_at);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    }
});

/**
 * @swagger
 * /check-email:
 *   post:
 *     summary: E-mail cím ellenőrzése regisztráció előtt
 *     description: Ellenőrzi, hogy a megadott e-mail cím már foglalt-e a rendszerben.
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
 *             properties:
 *               email:
 *                 type: string
 *                 example: "test@email.com"
 *                 description: Az ellenőrizni kívánt e-mail cím
 *     responses:
 *       200:
 *         description: Az e-mail cím elérhető
 *       400:
 *         description: Az e-mail cím már foglalt
 *       500:
 *         description: Szerver hiba az e-mail ellenőrzése során
 */

router.post("/check-email", async (req, res) => {
    const { email } = req.body;
    try {
        const emailExists = await checkEmail(email);
        if (emailExists) {
            return res.status(400).json({ message: "Ez az e-mail cím már foglalt!" });
        }
        return res.status(200).json({ message: "Az e-mail cím elérhető." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Hiba történt az e-mail ellenőrzése során!" });
    }
});

export {router as restaurantRouter};