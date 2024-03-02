<template>
    <div
        class="flex justify-between items-center w-full p-2 bg-opacity-40 rounded"
        :class="isWinner ? 'bg-green-400' : 'bg-red-400'"
    >
        <div class="flex flex-col">
            <div v-for="(user, i) of opposingTeam.users" :key="i">
                <span>{{ user.firstName }} {{ user.lastName?.[0] }}</span>
            </div>
            <span>
                {{ opposingTeam.elo }}
            </span>
        </div>
        <slot />
        <div class="flex flex-col text-right">
            <span>
                {{ DateTime.fromISO(match.updatedAt).toFormat('MM/dd h:mm a') }}
            </span>
            <span class="text-right w-full">{{ userTeam.score }} to {{ opposingTeam.score }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Match } from '@/types/match'
import type { User } from '@/types/users'
import { computed } from 'vue'
import { DateTime } from 'luxon'
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
