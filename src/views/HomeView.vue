<template>
    <main class="p-2">
        <LoadingScreen v-if="loadingData" class="mt-[30vh]"></LoadingScreen>

        <div v-else>
            <div>
                <h1 class="text-xl text-orange-500 font-semibold">Rankings</h1>

                <div class="mt-2 flex flex-col gap-4">
                    <div
                        v-for="(team, i) in rankings.SINGLES"
                        :key="i"
                        class="py-4 flex items-center justify-between text-orange-500 text-xl border-t border-t-orange-500"
                    >
                        <div class="flex items-center gap-2">
                            <span cl2ass="font-bold">{{ i + 1 }}</span>
                            <div v-for="(user, i) in team.users" :key="i">
                                <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                            </div>
                        </div>
                        <p>{{ team.elo }}</p>
                    </div>
                </div>
            </div>
            <div class="mt-8">
                <h1 class="text-xl text-blue-500 font-semibold">Recent Matches</h1>
                <div class="mt-2 flex flex-col gap-4">
                    <MatchSummaryCard
                        v-for="(match, index) of recentMatches"
                        :key="index"
                        :match="match"
                        class="rounded"
                    ></MatchSummaryCard>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { type Match, type MatchMode } from '../types/match'
import MatchSummaryCard from '@/components/MatchSummaryCard.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { onMounted, ref } from 'vue'
import { useTeamStore } from '@/stores/team'
import type { Team } from '@/types/team'
import { useMatchStore } from '@/stores/match'

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
