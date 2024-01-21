<template>
    <div class="flex flex-col rounded">
        <div
            class="flex justify-between items-center px-4 py-4 border rounded-t border-b-0 bg-gray-300"
        >
            <h2>{{ match.createdAt.toString() }}</h2>
            <h2>Up to: {{ match.winningScore }}</h2>
        </div>
        <TeamPlayerCard
            :team="match.teamA"
            :playerScore="match.teamA.score"
            :side="'teamA'"
        ></TeamPlayerCard>
        <TeamPlayerCard
            :team="match.teamB"
            :playerScore="match.teamA.score"
            :side="'teamB'"
            class="rounded-b"
        ></TeamPlayerCard>
    </div>
</template>

<script setup lang="ts">
import type { Match } from '@/types/match'
import TeamPlayerCard from './TeamPlayerCard.vue'
interface MatchConfig {
    match: Match
}

const { match } = defineProps<MatchConfig>()
</script>
