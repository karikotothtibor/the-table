
import express from "express";
import { reviewsList, reviewsAdd, UserAdd, UserList, UserDelete, UserUpdate, reviewLogoutList, reviewLogoutAdd } from "../service/restaurant-service.js";

const router = express.Router();


// user tábla---------------------------------------------------------------

router.get ("/user",async (req, res) => {
    try {
       const data = await UserList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post ("/useradd", async (req, res) => {
    const {name, email, phone, password} = req.body;
    try {
        const data = await UserAdd(name, email, phone, password);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

router.delete("/user/:id", async (req, res) => {
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
});
//reservation tábla---------------------------------------------------------
//table tábla---------------------------------------------------------------
//status tábla--------------------------------------------------------------
//notification tábla--------------------------------------------------------
//rewievs tábla-------------------------------------------------------------

router.get("/review",async (req, res) => {
    try {
        const data = await reviewsList();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post("/reviewsadd",async (req, res) => {
    const {rating, comment, created_at} = req.body;
    try {
        const data = await reviewsAdd(rating, comment, created_at,);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
})
//openning hours tábla------------------------------------------------------
//reviews logout tábla------------------------------------------------------

router.get("/reviewslogoutList", async (req, res) => {
    try {
        const data = await reviewLogoutList();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

router.post("/reviewslogoutadd", async (req, res) => {
    const {name, email, comment, rating } = req.body;
    try {
        const data = await reviewLogoutAdd(name, email, comment, rating);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});
export {router as restaurantRouter};