<template>
    <div class="py-2 px-4 flex justify-between items-center" :class="bgStyles">
        <div class="flex flex-col w-[70%]">
            <h1>{{ user.firstName }} {{ user.lastName }}</h1>
            <h2>{{ user.elo }}</h2>
        </div>
        <h1 class="text-2xl">{{ playerScore }}</h1>
    </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/users'
import { onMounted, ref } from 'vue'

interface Config {
    user: User
    playerScore: number
    side: 'sideA' | 'sideB'
}

const { user, playerScore, side } = defineProps<Config>()

const bgStyles = ref<string>('')
onMounted(() => {
    if (side === 'sideA') {
        bgStyles.value = 'bg-red-700 bg-opacity-40'
    } else {
        bgStyles.value = 'bg-blue-700 bg-opacity-40'
    }
})
</script>
