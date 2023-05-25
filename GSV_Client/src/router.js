import { createWebHistory, createRouter } from "vue-router";
import Session from "@/views/Session.vue";
import Authentication from "@/views/Authentication.vue";
import { store } from '@/store'

const routes = [
    {
        path: '/',
        name: `Home`,
        component: Session,
        meta: {
            requiresAuth: true
        },
        props: { isUser: true }
    },
    {
        path: "/user",
        name: "User",
        component: Session,
        meta: {
            requiresAuth: true
        },
        props: { isUser: true }
    },
    {
        path: "/moderator",
        name: "Moderator",
        component: Session,
        meta: {
            requiresAuth: true
        },
        props: { isUser: false }
    },
    {
        path: "/login",
        name: "Login",
        component: Authentication,
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