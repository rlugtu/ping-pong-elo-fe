<template>
    <main class="min-h-screen relative">
        <h1 class="p-2 text-slate-300 text-4xl font-semibold">Ping Pong</h1>

        <LoadingScreen
            v-if="!user"
            class="absolute top-0 h-screen w-screen flex justify-center items-center"
        ></LoadingScreen>
        <RouterView v-else class="font-sans bg-gray-900 pt-6 pb-[60px]" />
        <Navbar v-if="user" class="fixed bottom-0 w-full bg-slate-700 h-[80px]"></Navbar>
    </main>
</template>

<script lang="ts" setup>
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { computed, ref, watch } from 'vue'

const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => {
    return authStore.user?.sub
})

const user = computed(() => userStore.user)

watch(userId, async (userId) => {
    try {
        if (userId && !userStore.user) {
            await userStore.getUser(userId)
        }
    } catch (error) {
        if (!userStore.user && authStore.user) {
            const userInfo = authStore.createUserFromGoogleUser(authStore.user)
            await userStore.createUser(userInfo)
        }
    }
})
</script>
