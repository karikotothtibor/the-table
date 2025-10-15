import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path:"/",
            name: "Főoldal",
            component: () => import("../pages/App.vue"),
        },
        {
            path:"",
            name: "",
            component: () => import(""),
        },
    ],
});

export default router;
