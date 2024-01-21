<template>
    <div class="flex justify-between items-center p-2">
        <div class="flex items-center w-full">
            <span class="w-[50px] flex items-center justify-center">{{ match.teamA.score }} </span>
            <div class="flex flex-col ml-2">
                <h2>{{ match.teamA.users[0].firstName }}</h2>
                <p>{{ match.teamA.elo }}</p>
            </div>
        </div>
        <span>VS</span>
        <div class="flex items-center justify-end w-full">
            <div class="flex flex-col mr-2">
                <h2>{{ match.teamB.users[0].firstName }}</h2>
                <p>{{ match.teamB.elo }}</p>
            </div>
            <span class="w-[50px] flex items-center justify-center">{{ match.teamB.score }} </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface MatchConfig {
    match: Match
}
import { type Match } from '@/types/match'
const { match } = defineProps<MatchConfig>()
</script>
