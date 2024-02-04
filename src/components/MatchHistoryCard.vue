<template>
    <div
        class="flex justify-between items-center w-full p-2 bg-opacity-40 rounded"
        :class="isWinner ? 'bg-green-400' : 'bg-red-400'"
    >
        <div class="flex flex-col">
            <!-- <span>{{ isWinner ? 'W' : 'L' }}</span> -->

            <div v-for="(user, i) of opposingTeam.users" :key="i">
                <span>{{ user.firstName }} {{ user.lastName?.[0] }}</span>
            </div>
            <span>{{ opposingTeam.elo }}</span>
        </div>

        <div class="flex flex-col">
            <span>{{ match.mode }}</span>
            <span class="w-16 text-right">{{ userTeam.score }} to {{ opposingTeam.score }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Match } from '@/types/match'
import type { User } from '@/types/users'
import { computed } from 'vue'

const { match, user } = defineProps<{
    match: Match
    user: User
}>()

const isWinner = computed(() => {
    return user.teams.map((team) => team.id).includes(match.winningTeamId)
})

const opposingTeam = computed(() => {
    if (match.teamA.users.find((u) => u.id === user.id)) {
        return match.teamB
    }
    return match.teamA
})

const userTeam = computed(() => {
    if (match.teamA.users.find((u) => u.id === user.id)) {
        return match.teamA
    }
    return match.teamB
})
</script>
