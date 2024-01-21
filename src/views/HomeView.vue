<template>
    <main class="p-2">
        <div>
            <h1 class="text-xl">Rankings</h1>

            <div
                v-for="(team, i) in rankings.SINGLES"
                :key="i"
                class="py-4 px-3 mt-2 bg-gray-300 flex items-center justify-between rounded"
            >
                <div class="flex items-center gap-2">
                    <span class="font-bold">{{ i + 1 }}</span>
                    <div v-for="(user, i) in team.users" :key="i">
                        <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                    </div>
                </div>
                <p>{{ team.elo }}</p>
            </div>
        </div>
        <div class="mt-6">
            <h1 class="text-xl">Recent Matches</h1>
            <div class="flex flex-col gap-4">
                <MatchSummaryCard
                    v-for="(match, index) of recentMatches"
                    :key="index"
                    :match="match"
                    class="rounded"
                ></MatchSummaryCard>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { type Match, type MatchMode } from '../types/match'
import MatchSummaryCard from '@/components/MatchSummaryCard.vue'
import { onMounted, ref } from 'vue'
import { testMatch } from '@/utils/testStubs'
import { useTeamStore } from '@/stores/team'
import type { Team } from '@/types/team'

const teamStore = useTeamStore()

const liveMatch = ref<Match | null>(null)
const recentMatches = ref<Match[]>([])
const rankings = ref<Record<MatchMode, Team[]>>({
    SINGLES: [],
    DOUBLES: []
})

async function loadLiveMatch(): Promise<Match | void> {
    return testMatch
}

async function getRankings(): Promise<Team[]> {
    return await teamStore.getTeamsByElo({
        matchMode: 'SINGLES',
        limit: 5,
        sort: 'desc'
    })
}

onMounted(async () => {
    try {
        const match = await loadLiveMatch()
        if (!match) {
            return
        }

        liveMatch.value = match
        recentMatches.value = [match, match]

        rankings.value.SINGLES = await teamStore.getTeamsByElo({
            matchMode: 'SINGLES',
            limit: 5,
            sort: 'desc'
        })
    } catch (error) {}
})
</script>
