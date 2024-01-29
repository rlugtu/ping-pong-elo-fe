<template>
    <div class="flex justify-between items-center p-2 text-lg text-blue-500">
        <div class="flex justify-between w-full">
            <div>
                <div v-for="(user, i) of opposingTeam.users" :key="i" class="flex gap-2">
                    <h2>{{ user.firstName }}</h2>
                </div>
                <p>{{ opposingTeam.elo }}</p>
            </div>
            <div class="flex flex-col text-right">
                <span>{{
                    match.mode.slice(0, 1).toUpperCase() + match.mode.slice(1).toLowerCase()
                }}</span>
                <span>First to {{ match.winningScore }}</span>
            </div>
        </div>
        <span class="text-slate-300"></span>
    </div>
</template>

<script lang="ts" setup>
interface MatchConfig {
    match: Match
    user: User
}
import { type Match } from '@/types/match'
import type { User } from '@/types/users'
import { computed } from 'vue'
const { match, user } = defineProps<MatchConfig>()

const opposingTeam = computed(() => {
    const matchingTeam = match.teamA.users.some((u) => u.id === user.id) ? match.teamB : match.teamA

    return matchingTeam
})
</script>
