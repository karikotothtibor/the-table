import express, { json, Router } from "express";
import {PrismaClient} from "./generated/prisma/index.js";
import { restaurantRouter } from "./controller/restaurant-controll.js";
import cors from "cors";

const app = express();
const port = 3300;

app.use(express.json());

const prisma = new PrismaClient();

const corsOption = {
    origin: "http://localhost:5173",
    methods : "GET,POST",
    alloweeHeaders : "Content-type : application/json, Authorization",
    optionSuccesStatus: 200
}

app.use(cors(corsOption));
app.use(restaurantRouter);

app.listen(port,()=>{
    console.log("A szerver elindult a 3300-as porton.");
});