
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
    tableUpdate} from "../service/restaurant-service.js";

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

//reservation tábla----------------------------------------------------------

router.get ("/reservation",async (req, res) => {
    try {
       const data = await reservationList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post ("/reservationadd", async (req, res) => {
    const {user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers} = req.body;
    try {
        const data = await reservationAdd(user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

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

//table tábla-------------------------------------------------------------

router.get ("/table",async (req, res) => {
    try {
       const data = await tableList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post ("/tableadd", async (req, res) => {
    const {capacity} = req.body;
    try {
        const data = await tableAdd(capacity);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

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

router.get ("/status",async (req, res) => {
    try {
       const data = await statusList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

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

//notification tábla--------------------------------------------------------------------

router.get ("/notificatiom",async (req, res) => {
    try {
       const data = await notificationList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post ("/notification", async (req, res) => {
    const {message,status,user_id,reservation_id} = req.body;
    try {
        const data = await notificationAdd(message,status,user_id,reservation_id);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    };
    
});

router.delete("/notification/:id", async (req, res) => {
    const id = req.params.id
    try {
        const data = await notificationDelete(id);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error});
    };
});

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

//rewievs tábla---------------------------------------------------------------

router.get("/review",async (req, res) => {
    try {
        const data = await reviewsList();
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

router.post("/reviewadd",async (req, res) => {
    const {rating, comment, created_at} = req.body;
    try {
        const data = await reviewsAdd(rating, comment, created_at,);
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

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
router.get ("/openninghours",async (req, res) => {
    try {
       const data = await openningHourList();
       res.status(200).json(data); 
    } catch (error) {
        console.log(error);
        res.status(400).json({message: error});
    }
});

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

export {router as restaurantRouter};