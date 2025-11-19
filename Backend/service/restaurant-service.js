import {PrismaClient} from "../generated/prisma/index.js"

const prisma = new PrismaClient();

// user tábla---------------------------------------------------------------

export async function UserList(req,res) {
    const data = await prisma.users.findMany({})
    return data;
};

export async function UserAdd(name, email, phone, password) {
    await prisma.users.create({
        data:{
            name: name,
            email: email,
            phone: phone,
            password: password
        }
    });
    return {message: "Sikeresen létrehozva!"};  
};
export async function UserDelete(id) {
    await prisma.users.findFirst({
        where:{
            id:Number(id) ,       
            }
    })
    return{message: "A Felhasználó sikeresen eltávolítva!"}
};
export async function UserUpdate(id,name, phone, email, password) {
    await prisma.users.update({
        data: {
            name: name,
            phone: phone,
            email: email,
            password: password
        },
        where:{
            id:Number(id),
        }
    })
    return{message: "Sikeresen frissitve"}
}

//reviews tábla-------------------------------------------------------------


export async function reviewsList(req, res) {
    const data = await prisma.reviews.findMany({

    });
    return data;
};

export async function reviewsAdd(rating, comment, created_at, reservation_id, user_id) {
    await prisma.reviews.create({
        data:{
            rating: Number(rating),
            comment: comment,
            created_at: created_at,
            user: {
                connect: { id: user_id }
            },
            reservation:{
                connect: { id: reservation_id}                 
                }
            }
    });
    return {message: "Sikeresen létrehozva!"};
};

export async function reviewDelete(id) {
    await prisma.reviews.delete({
        where:{
            id : Number(id)
        }
    })
    return{message: "Sikeresen törölve!"}
};

export async function reviewUpdate(id, rating, comment, created_at) {
    await prisma.reviews.update({
        data:{
            rating: Number(rating),
            comment: comment,
            created_at: created_at
        },
        where:{
            id:Number(id)
        }
    })
    return{message: "Sikeresen frissitve vannak az adat(ok)!"}    
};
//reservation tábla---------------------------------------------------------

export async function reservationList(res,req) {
    const data = await prisma.reservation.findMany({})
    return(data);
};

export async function reservationAdd(user_id, status_id, table_id, dtime_from, dtime_to, number_of_customers) {
    
    const tableID = await prisma.tables.findUnique({
            where:{
                id: Number(table_id),
            }
    })
    if (!tableID) throw new console.error("Asztal nem található!");
    
    const statusID = await prisma.reservation_status.findUnique({
        where:{
            id: Number(status_id)
        }
    })
    if (!statusID) throw new console.error("Nincs a foglaláshoz státusz!");


    await prisma.reservation.create({
        data : {
           user: {connect:{id:user_id}},
            table_id: Number(table_id),
            status_id: Number(status_id),
            dtime_from: new Date(dtime_from),
            dtime_to: new Date(dtime_to),
            number_of_customers: Number(number_of_customers)
        }
    })
    return{message:"Sikeresen létrehozva!"}
};

export async function reservationDelete(id) {
await prisma.reservation.delete({
    where:{
        id : Number(id)
    }
})    
return {message: "Sikeresen törölve!"};
};

export async function reservationUpdate(id, dtime_from, dtime_to, number_of_customers) {
    await prisma.reservation.update({
        data:{
            dtime_from: new Date(dtime_from),
            dtime_to: new Date(dtime_to),
            number_of_customers: Number(number_of_customers)
        },
        where:{
            id: Number(id),
        }
    })
    return{message: "Sikeresen megváltoztattad a foglalást!"}
}
//table tábla---------------------------------------------------------------

export async function tableList(req, res) {
    const data = await prisma.tables.findMany({})
        return data;
}

export async function tableAdd(capacity) {
    await prisma.tables.create({
        capacity: Number(capacity)
    })
    return{message: "Sikeresen létrehozva!"}
}

export async function tableDelete(id) {
    await prisma.tables.delete({
        where:{
            id:Number(id),
        }
    })
    return{message: "Sikeresen törölve!"};
}

export async function tableUpdate(id, capacity) {
    await prisma.tables.update({
        data: {
            capacity: Number(capacity)
        },
        where:{
            id: Number(id),
        }
    })
    return{message: "Az adatok sikeresen frissitve!"};
}

//status tábla--------------------------------------------------------------
export async function statusList(res) {
    const data = await prisma.reservation_status.findMany({})
    return data;
}


export async function statusAdd(status) {
    await prisma.reservation_status.create({
        data:{
            status: status,
        }
    })
    return{message: "Sikeresen létrehozva!"}
}

export async function statusUpdate(id, status) {
    await prisma.reservation_status.update({
        data:{
            status: status
        },
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen frissitve a status tábla!"};
}

export async function statusDelete(id) {
    await prisma.reservation_status.delete({
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen törölte a státuszt!"}
}
//notification tábla--------------------------------------------------------
export async function notificationList(req) {
    const data = await prisma.notifications.findMany({})
    return data;    
};

export async function  notificationAdd(message,status,user_id,reservation_id) {
    await prisma.notifications.create({
        data:{
            message: message,
            status: status,
            user:{
                connect:{id: user_id}
            },
            reservation_id:{
                connect:{id: reservation_id}
            }
        }
    })
    return{message: "Sikeresen létrehozva!"};
};

export async function notificationDelete(id) {
   await prisma.notifications.delete({
    where:{
        id: Number(id)
    }
   })
   return{message: "Sikersen törölve!"}; 
};

export async function notificationUpdate(id,message,status) {
    await prisma.notifications.update({
        data:{
            message: message,
            status : status
        },
        where:{
            id:Number(id)
        }
    })
    return{message:"Sikeresen frissitve!"};    
}
//openning hours tábla------------------------------------------------------

export async function openningHourList(req,res) {
const adat = await prisma.opening_hours.findMany({})
    return adat;    
};

export async function openningHourAdd(day_of_week, open_time, close_time) {
    await prisma.opening_hours.create({
        adat:{
            day_of_week: day_of_week,
            open_time: open_time,
            close_time: close_time
        }
    })
    return{message: "Sikeresen létrehozva!"};
}

export async function openningHourDelete(id) {
   await prisma.opening_hours.delete({
    where:{
        id: Number(id)
    }
   })
   return{message: "Sikeresen törölve!"}; }

export async function openningHourUpdate(id, day_of_week, open_time, close_time) {
   await prisma.opening_hours.update({
    data:{
        day_of_week: day_of_week,
        open_time: open_time,
        close_time: close_time
    },
    where:{
        id: Number(id)
    }
   })
   return{message: "Sikeresen frissitve!"}; }

//reviews_logout tábla------------------------------------------------------   

export async function reviewLogoutList(req, res) {
    const data = await prisma.reviews_logout.findMany({})
    return data;
};

export async function reviewLogoutAdd(name, email, comment, rating) {
    await prisma.reviews_logout.create({
        data:{
            name: name,
            email: email,
            comment: comment,
            rating: Number(rating),
            //created_at: created_at,
        }
    })
    return{message: "Sikeresen létrehozva!"};
};

export async function reviewLogoutDelete(id) {
    await prisma.reviews_logout.delete({
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen törölve!"}
};

export async function reviewLogoutUpdate(id, name, email, comment, rating, created_at) {
    await prisma.reviews_logout.update({
        data:{
            name: name,
            email: email,
            comment: comment,
            rating: Number(rating),
            created_at: created_at
        },
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen frissitve!"}
};

export async function reviewLogoutList(req, res) {
    const data = await prisma.reviews_logout.findMany({})
    return data;
};

export async function reviewLogoutAdd(name, email, comment, rating) {
    await prisma.reviews_logout.create({
        data:{
            name: name,
            email: email,
            comment: comment,
            rating: Number(rating),
            //created_at: created_at,
        }
    })
    return{message: "Sikeresen létrehozva!"};
};

export async function reviewLogoutDelete(id) {
    await prisma.reviews_logout.delete({
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen törölve!"}
};

export async function reviewLogoutUpdate(id, name, email, comment, rating, created_at) {
    await prisma.reviews_logout.update({
        data:{
            name: name,
            email: email,
            comment: comment,
            rating: Number(rating),
            created_at: created_at
        },
        where:{
            id: Number(id)
        }
    })
    return{message: "Sikeresen frissitve!"}
};
