import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:"/",
            name: "Főoldal",
            component: () => import("../pages/Home.vue"),
        },
        {
            path:"/login",
            name: "Login/Registration",
            component: () => import("../pages/Login.vue"),
        },
        {
            path:"/reservation",
            name: "Reservation",
            component: () => import("../pages/Reservation.vue"),
        },
        {
            path:"/user",
            name: "UserProfile",
            component: () => import("../components/UserProfile.vue"),
        },
    ],
});

export default router;
