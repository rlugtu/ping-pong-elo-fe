<template>
    <header class="h-[100px] p-2 font-semibold text-slate-300 flex items-center">
        <h1 class="text-6xl">Ping Pong</h1>
    </header>
    <LoadingScreen
        v-if="!user"
        class="absolute top-0 h-screen w-screen flex justify-center items-center"
    ></LoadingScreen>
    <RouterView v-else class="font-sans bg-gray-900" :class="bodyHeightWithoutHeaderOrNav" />
    <Navbar v-if="user" class="fixed bottom-0 w-full bg-slate-700 h-16"></Navbar>
</template>

<script lang="ts" setup>
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import Navbar from '@/components/Navbar.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { computed, ref, watch } from 'vue'

const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => {
    return authStore.user?.sub
})

const user = computed(() => userStore.user)

const bodyHeightWithoutHeaderOrNav = ref('h-[calc(100vh_-_4rem_-_100px)]')

watch(userId, async (userId) => {
    try {
        if (userId && !userStore.user) {
            const user = await userStore.getUser(userId)

            if (!user && authStore.user) {
                const userInfo = authStore.createUserFromGoogleUser(authStore.user)
                userStore.user = await userStore.createUser(userInfo)
            }
        }
    } catch (error) {
        console.log('error', error)
    }
})
</script>
