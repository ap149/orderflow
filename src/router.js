import { createRouter, createWebHistory } from 'vue-router';
import Orderflow from './components/Orderflow.vue';
import Journal from './components/Journal.vue';
import Delta from './components/Delta.vue';
const routes = [
    {
        path: '/',
        // component: Home
        redirect: '/journal',
    },
    {
        path: '/orderflow',
        name: "Orderflow",
        component: Orderflow
    },
    {
        path: '/journal',
        name: "Journal",
        component: Journal
    },
    {
        path: '/delta',
        name: "Delta",
        component: Delta
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;