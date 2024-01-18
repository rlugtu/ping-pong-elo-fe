<template>
    <div class="py-2 px-4 flex justify-between items-center" :class="bgStyles">
        <div class="flex flex-col w-[70%]">
            <div v-for="(user, i) of team.users" :key="i">
                {{ user.firstName }}
                {{ user.lastName }}
                {{ user.elo }}
            </div>
        </div>
        <h1 class="text-2xl">{{ playerScore }}</h1>
    </div>
</template>

<script setup lang="ts">
import type { Team } from '@/types/team'
import { onMounted, ref } from 'vue'

interface Config {
    team: Team
    playerScore: number
    side: 'teamA' | 'teamB'
}

const { team, playerScore, side } = defineProps<Config>()

const bgStyles = ref<string>('')
onMounted(() => {
    if (side === 'teamA') {
        bgStyles.value = 'bg-red-700 bg-opacity-40'
    } else {
        bgStyles.value = 'bg-blue-700 bg-opacity-40'
    }
})
</script>
