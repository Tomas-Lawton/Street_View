import { createWebHistory, createRouter } from "vue-router";
import { store } from '@/store'

const routes = [
    {
        path: '/',
        name: `Home`,
        component: () => import("@/views/SessionContainer.vue"),
        meta: {
            requiresAuth: true
        },
        props: { isUser: true }
    },
    {
        path: "/user",
        name: "User",
        component: () => import("@/views/SessionContainer.vue"),
        meta: {
            requiresAuth: true
        },
        props: { isUser: true }
    },
    {
        path: "/moderator",
        name: "Moderator",
        component: () => import("@/views/SessionContainer.vue"),
        meta: {
            requiresAuth: true
        },
        props: { isUser: false }
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Authentication.vue"),
    },
];

console.log("Available routes: ", routes)

const router = createRouter({
    history: createWebHistory(),
    base: '/',
    routes,
});

router.beforeEach((to, from, next)=> {
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