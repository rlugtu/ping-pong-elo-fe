<template>
    <div class="p-2">
        <div>
            <h1 class="text-xl">Rankings</h1>
        </div>
        <h1 class="text-xl">Recent Matches</h1>
        <MatchSummaryCard
            v-for="(match, index) of recentMatches"
            :key="index"
            :match="match"
            class="mt-4 rounded"
        ></MatchSummaryCard>
    </div>
</template>

<script setup lang="ts">
import { type Match } from '../types/match'
import MatchSummaryCard from '@/components/MatchSummaryCard.vue'
import { onMounted, ref } from 'vue'
import { testMatch } from '@/utils/testStubs'

const liveMatch = ref<Match | null>(null)
const recentMatches = ref<Match[]>([])

async function loadLiveMatch(): Promise<Match | void> {
    return testMatch
}

onMounted(async () => {
    const match = await loadLiveMatch()
    if (!match) {
        return
    }

    liveMatch.value = match
    recentMatches.value = [match, match]
})
</script>
