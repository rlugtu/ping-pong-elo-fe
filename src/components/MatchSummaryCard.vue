<template>
    <div class="flex flex-col rounded">
        <div
            class="flex justify-between items-center p-2 bg-blue-700 rounded-t border-b-0 text-white"
        >
            <h2 class="text-md">
                {{ DateTime.fromISO(match.createdAt).toFormat('MMMM dd, yyyy') }}
            </h2>
            <h2>{{ match.mode[0] + match.mode.slice(1).toLowerCase() }}</h2>
        </div>
        <TeamPlayerCard
            :team="match.teamA"
            :playerScore="match.teamA.score"
            :side="'teamA'"
        ></TeamPlayerCard>
        <TeamPlayerCard
            :team="match.teamB"
            :playerScore="match.teamB.score"
            :side="'teamB'"
            class="rounded-b border-t border-slate-400"
        ></TeamPlayerCard>
    </div>
</template>

<script setup lang="ts">
import type { Match } from '@/types/match'
import TeamPlayerCard from './TeamPlayerCard.vue'
import { DateTime } from 'luxon'
interface MatchConfig {
    match: Match
}

const { match } = defineProps<MatchConfig>()
</script>
