<template>
    <div class="flex rounded-lg bg-[#3557FC] px-2 py-3" ref="scrollTarget">
        <TeamPlayerCard :team="match.teamA" :playerScore="match.teamA.score" :side="'teamA'" />
        <div class="flex justify-center items-center grow h-full">
            <!-- Move to expanded view
            <div class="w-full flex justify-between">
                <p class="text-xs">
                    {{ DateTime.fromISO(match.updatedAt).toFormat('LLL dd') }}
                </p>
                <p class="text-xs">{{ match.mode[0] + match.mode.slice(1).toLowerCase() }}</p>
            </div> -->
            <p class="text-3xl font-unbounded">{{ match.teamA.score }}<span class="px-1">:</span>{{ match.teamB.score }}</p>
        </div>
        <TeamPlayerCard :team="match.teamB" :playerScore="match.teamB.score" :side="'teamB'" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Match } from '@/types/match'
import TeamPlayerCard from './TeamPlayerCard.vue'
import { DateTime } from 'luxon'
import { useMotion } from '@vueuse/motion'

interface MatchConfig {
    match: Match
}

const scrollTarget = ref()

useMotion(scrollTarget, {
    initial: {
        opacity: 0,
        y: 100,
        scale: 0.6
    },
    visibleOnce: {
        opacity: 1,
        y: 0,
        scale: 1
    }
})

const { match } = defineProps<MatchConfig>()
</script>
