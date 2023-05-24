import { createWebHistory, createRouter } from "vue-router";
import User from "@/views/User.vue";
import Moderator from "@/views/Moderator.vue";
import Landing from "@/views/Landing.vue";
import { store } from '@/store'

//const isLoggedIn = true

const routes = [
    {
        path: '/',
        name: `Home`,
        component: User,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/user",
        name: "User",
        component: User,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/moderator",
        name: "Moderator",
        component: Moderator,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Landing,
    }
];

const router = createRouter({
    history: createWebHistory(),
    base: import.meta.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next)=>{
    console.log(to.name);
    console.log("state loggedin", store.state.isLoggedIn);
    console.log("api key", store.state.apiKey);

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.isLoggedIn) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath,
                }
            })
        } else {
            next()
        }
    } else {
        next() // remember to always call next()
    }
})

export default router;