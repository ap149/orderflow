import { createRouter, createWebHistory } from 'vue-router';
import Orderflow from './components/Orderflow.vue';
import Journal from './components/Journal.vue';

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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;