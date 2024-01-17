<template>
    <div class="flex flex-col rounded">
        <div class="flex justify-between items-center px-4 py-4 border rounded-t border-b-0">
            <h2>{{ match.createdAt.toDateString() }}</h2>
            <h2>Up to: {{ match.winningScore }}</h2>
        </div>
        <MatchPlayerCard
            :user="match.sideA[0]"
            :playerScore="match.sideAScore"
            :side="'sideA'"
        ></MatchPlayerCard>
        <MatchPlayerCard
            :user="match.sideB[0]"
            :playerScore="match.sideBScore"
            :side="'sideB'"
            class="rounded-b"
        ></MatchPlayerCard>
    </div>
</template>

<script setup lang="ts">
import type { Match } from '@/types/match'
import MatchPlayerCard from './MatchPlayerCard.vue'
interface MatchConfig {
    match: Match
}

const { match } = defineProps<MatchConfig>()
</script>
