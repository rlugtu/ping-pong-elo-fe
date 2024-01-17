import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Callback from '../views/Callback.vue'
import Profile from '../views/Profile.vue'
import { authGuard } from '@auth0/auth0-vue'
import LobbiesVue from '@/views/Lobbies.vue'

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
            path: '/profile',
            name: 'profile',
            component: Profile,
            beforeEnter: authGuard
        },
        {
            path: '/lobbies',
            name: 'lobbies',
            component: LobbiesVue,
            beforeEnter: authGuard
        }
    ]
})

export default router
