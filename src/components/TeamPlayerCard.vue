<template>
    <div class="w-20 flex flex-col flex-none justify-between items-center">
        <div v-for="(user, i) of team.users" :key="i" class="flex flex-col items-center">
            <span class="text-sm md:text-base">
                {{ user.firstName }}
            </span>
            <span class="px-0.5 py-0.5 w-10 bg-[#FFE5D4] rounded-full text-[10px] text-center text-orange-600">
                {{ team.elo }}
            </span>
        </div>
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

const { team, side } = defineProps<Config>()

const bgStyles = ref<string>('')
onMounted(() => {
    if (side === 'teamA') {
        bgStyles.value = 'bg-green-700 bg-opacity-40'
    } else {
        bgStyles.value = 'bg-blue-700 bg-opacity-40'
    }
})
</script>
