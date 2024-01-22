<template>
    <main class="p-2 flex flex-col justify-center text-slate-300">
        <div class="mx-auto flex flex-col justify-center items-center gap-4 pt-16">
            <div
                class="border border-gray-300 rounded-full w-[100px] h-[100px] flex flex-col justify-center items-center"
            >
                <font-awesome-icon icon="fa-solid fa-user" class="text-5xl mb-2" />
            </div>
            <h1>{{ user?.firstName }} {{ user?.lastName }}</h1>
        </div>
        <div class="mt-6 min-h-[100px]">
            <h1 class="text-2xl font-bold">My Teams</h1>
        </div>
        <div class="mt-6 min-h-[100px]">
            <h1 class="text-2xl font-bold">Match History</h1>
        </div>
        <button
            @click="authStore.handleLogout"
            class="bg-red-500 w-[150px] rounded-xl p-4 mx-auto mt-6"
        >
            Logout
        </button>
    </main>
</template>
<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { computed, onMounted } from 'vue'
import router from '@/router'

const user = computed(() => userStore.user)

const userStore = useUserStore()
const authStore = useAuthStore()

onMounted(() => {
    if (!userStore.user) {
        router.push('/')
    }
    console.log(user.value)
})
</script>
