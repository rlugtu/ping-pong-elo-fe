<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </header>
    <Loading
        v-if="!user"
        class="absolute top-0 h-screen w-screen flex justify-center items-center"
    ></Loading>
    <RouterView v-else />
    <Navbar v-if="user" class="fixed bottom-0 w-full bg-gray-600 h-16"></Navbar>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import Navbar from '@/components/Navbar.vue'
import Loading from '@/components/Loading.vue'
import { computed, watch } from 'vue'

const userStore = useUserStore()
const authStore = useAuthStore()

const userId = computed(() => {
    return authStore.user?.sub
})

const user = computed(() => userStore.user)

watch(userId, async (userId) => {
    if (userId && !userStore.user) {
        const user = await userStore.getUser(userId)
        if (!user && authStore.user) {
            const userInfo = authStore.createUserFromGoogleUser(authStore.user)
            await userStore.createUser(userInfo)
        }
    }
})
</script>
