<template>
    <div class="px-2 py-1 flex justify-between items-center bg-slate-300">
        <div class="flex flex-col w-[70%]">
            <div v-for="(user, i) of team.users" :key="i">
                <span>
                    {{ user.firstName }}
                    {{ user.lastName }}
                </span>
                <span class="ml-1 text-sm text-orange-600">
                    {{ team.elo }}
                </span>
            </div>
        </div>
        <h1 class="text-lg">{{ playerScore }}</h1>
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
        bgStyles.value = 'bg-green-700 bg-opacity-40'
    } else {
        bgStyles.value = 'bg-blue-700 bg-opacity-40'
    }
})
</script>
