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
//table tábla---------------------------------------------------------------
//status tábla--------------------------------------------------------------
//notification tábla--------------------------------------------------------
//openning hours tábla------------------------------------------------------
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
