import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Callback from '../views/Callback.vue'
import Profile from '../views/Profile.vue'
import { authGuard } from '@auth0/auth0-vue'
import Lobbies from '@/views/Lobbies.vue'
import Match from '@/views/Match.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            beforeEnter: authGuard
        },
        {
            path: '/callback',
            name: 'callback',
            component: Callback,
            beforeEnter: authGuard
        },
        {
            path: '/callback/:id',
            name: 'callback',
            component: Callback,
            beforeEnter: authGuard
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            beforeEnter: authGuard
        },
        {
            path: '/lobbies',
            name: 'lobbies',
            component: Lobbies,
            beforeEnter: authGuard
        },
        {
            path: '/match/:id',
            name: 'match',
            component: Match,
            beforeEnter: authGuard
        }
    ]
})

export default router
