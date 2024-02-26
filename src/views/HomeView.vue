<template>
    <TableLayout>
        <template v-slot:top>
            <h1 class="text-xl font-unbounded font-semibold mb-2.5">Recent Matches</h1>
            <LoadingScreen v-if="loadingData" class="mt-[25%]"></LoadingScreen>
            <div v-else class="flex flex-col overflow-scroll rounded-lg">
                <div class="flex flex-col gap-[0.625rem]">
                    <MatchSummaryCard v-for="(match, index) of recentMatches" :key="index" :match="match" class="rounded">
                    </MatchSummaryCard>
                </div>
            </div>
        </template>

        <template v-slot:bottom>
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-unbounded font-semibold mb-2.5">Rankings</h1>
                <router-link to="/player/search" class="text-sm text font-bold opacity-60">View all</router-link>
            </div>
            <LoadingScreen v-if="loadingData" class="mt-[25%]"></LoadingScreen>

            <div v-else class="flex flex-col overflow-scroll rounded-lg">
                <div class="flex flex-col gap-[0.625rem]">
                    <!-- <RankingCard v-for="(team, i) in rankings.SINGLES" :key="i" /> -->
                    <RankingCard v-for="(team, i) in mockData" :team="team" :place="i + 1"></RankingCard>
                </div>
            </div>
        </template>
    </TableLayout>
</template>

<script setup lang="ts">
import { type Match, type MatchMode } from '../types/match'
import MatchSummaryCard from '@/components/MatchSummaryCard.vue'
import RankingCard from '@/components/RankingCard.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import TableLayout from '@/components/layouts/TableLayout.vue'
import { onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/team'
import type { Team } from '@/types/team'
import { useMatchStore } from '@/stores/match'

// MAKE SURE TO REMOVE MOCK DATA
const mockData = [
    {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }, {
        users: [{ firstName: 'Anthony', lastName: 'Mercado' }],
        elo: 1200
    }
]

const loadingData = ref(false)
const teamStore = useTeamStore()
const matchStore = useMatchStore()

const recentMatches = ref<Match[]>([])
const rankings = ref<Record<MatchMode, Team[]>>({
    SINGLES: [],
    DOUBLES: []
})

onMounted(async () => {
    try {
        loadingData.value = true

        recentMatches.value = await matchStore.getAllMatchesByState('COMPLETED')

        rankings.value.SINGLES = await teamStore.getTeamsByElo({
            matchMode: 'SINGLES',
            limit: 5,
            sort: 'desc'
        })
    } catch (error) {
        console.log(error)
    } finally {
        loadingData.value = false
    }
})
</script>
