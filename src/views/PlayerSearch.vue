<template>
    <div class="w-full px-2 animate-fadeIn">
        <div class="w-full flex items-end">
            <input
                type="text"
                placeholder="Search"
                class="px-2 w-[80%] bg-transparent border-b border-b-orange-500 outline-none text-orange-500 text-xl placeholder-orange-500"
            />
            <button class="bg-orange-500 h-full p-4 w-[20%] text-white font-bold">Search</button>
        </div>
        <LoadingScreen
            v-if="loading"
            class="h-[500px] flex justify-center items-center"
        ></LoadingScreen>
        <div class="mt-14 animate-fadeIn" v-else>
            <h2 class="text-3xl text-blue-500">Results</h2>
            <div
                v-for="(user, i) in users"
                :key="i"
                class="p-2 text-blue-400 flex items-center justify-between border-b border-b-blue-500 py-4"
            >
                <div class="flex flex-col">
                    <h1>{{ user.firstName }} {{ user.lastName }}</h1>
                </div>
                <div class="flex gap-4">
                    <button class="border border-blue-500 rounded py-2 px-4">Challenge</button>
                    <button class="border border-orange-500 text-orange-500 rounded px-4">
                        Visit
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/users'

const userStore = useUserStore()

const loading = ref(false)
const users = ref<User[]>([])

onMounted(async () => {
    try {
        console.log('hi')
        loading.value = true
        const data = await userStore.getAllUsers()

        console.log(data)
        users.value = data
    } catch (error) {
    } finally {
        loading.value = false
    }
})
</script>
