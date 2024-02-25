<template>
    <TableLayout>
        <template v-slot:top>
            <h1 class="text-xl font-semibold mb-2.5">Recent Matches</h1>
            <LoadingScreen v-if="loadingData" class="mt-[30vh]"></LoadingScreen>
            <div v-else class="flex flex-col overflow-scroll rounded-lg">
                <div class="flex flex-col gap-[0.625rem]">
                    <MatchSummaryCard v-for="(match, index) of recentMatches" :key="index" :match="match" class="rounded">
                    </MatchSummaryCard>
                </div>
            </div>
        </template>

        <template v-slot:bottom>
            <LoadingScreen v-if="loadingData" class="mt-[30vh]"></LoadingScreen>

            <div v-else class="animate-fadeIn">
                <div class="pt-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl font-semibold">Rankings</h1>
                        <router-link to="/player/search" class="text-blue-500 font-bold">View all</router-link>
                    </div>

                    <div class="flex flex-col">
                        <div v-for="(team, i) in rankings.SINGLES" :key="i"
                            class="py-4 flex items-center justify-between text-orange-500 text-lg border-t border-t-orange-500">
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
            </div>
        </template>
    </TableLayout>
</template>

<script setup lang="ts">
import { type Match, type MatchMode } from '../types/match'
import MatchSummaryCard from '@/components/MatchSummaryCard.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import TableLayout from '@/components/TableLayout.vue'
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
