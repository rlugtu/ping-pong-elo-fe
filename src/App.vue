<template>
    <main class="min-h-screen relative">
        <h1 class="p-2 text-slate-300 text-4xl font-semibold">Ping Pong</h1>

        <RouterView class="font-sans bg-gray-900 pt-6 pb-[120px]" />
        <Navbar v-if="user" class="fixed bottom-0 w-full bg-slate-700 h-[80px]"></Navbar>
    </main>
</template>

<script lang="ts" setup>
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import { computed, watch } from 'vue'
import router from './router'
import { socket, socketSetup } from './socket'

const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => {
    return authStore.user?.sub
})

const user = computed(() => userStore.user)

watch(userId, async (userId) => {
    try {
        if (userId && !userStore.user) {
            const user = await userStore.getUser(userId)

            if (user && socket.id) {
                socketSetup(user.id, socket.id)
            }
        }
    } catch (error) {
        router.push('/user-setup')
    }
})
</script>
