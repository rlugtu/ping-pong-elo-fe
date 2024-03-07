<template>
    <Layout>
        <div class="flex flex-col gap-3 items-center overflow-auto">
            <div class="flex flex-col gap-1 text-center w-full">
                <div class="w-full flex justify-end">
                    <button
                        @click="authStore.handleLogout"
                        class="w-[150px] rounded-xld flex justify-end items-center"
                    >
                        Logout
                        <font-awesome-icon icon="fa-solid fa-door-open" class="ml-2" />
                    </button>
                </div>

                <p class="text-3xl text-medium font-unbounded">
                    {{ user?.firstName }} {{ user?.lastName }}
                </p>
                <p class="text-lg text-gray-200" v-if="user?.department">{{ user.department }}</p>
                <p class="font-bold">{{ user?.elo }}</p>
            </div>
            <EloChart :team-id="userSoloTeamId" />
            <div class="w-full font-unbounded">
                <div class="grid grid-cols-2 gap-6">
                    <div class="grid grid-cols-2">
                        <h1 class="col-span-2 text-md text-center font-semibold mb-2.5 text-nowrap">
                            Current Season
                        </h1>
                        <span class="text-center text-xl text-green-500 font-bold">
                            {{ user?.performanceSummary.totalWins }}</span
                        >
                        <span class="text-center text-xl text-red-500 font-bold">
                            {{ user?.performanceSummary.totalLosses }}</span
                        >
                    </div>
                    <div class="grid grid-cols-2">
                        <h1 class="col-span-2 text-md text-center font-semibold mb-2.5">Total</h1>
                        <span class="text-center text-xl text-green-500 font-bold">
                            {{ user?.performanceSummary.totalWins }}</span
                        >
                        <span class="text-center text-xl text-red-500 font-bold">
                            {{ user?.performanceSummary.totalLosses }}</span
                        >
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex items-center mb-2">
                    <h1 class="text-xl font-unbounded font-semibold w-[80%]">H2H</h1>
                    <span class="grow text-center font-bold"> W </span>
                    <span class="grow text-center font-bold"> L </span>
                </div>
                <div v-for="(matchup, i) in user?.performanceSummary.headToHeads" class="flex">
                    <div class="flex w-[80%]">
                        <p v-for="(name, i) in matchup.record.userNames">
                            {{ name }}
                        </p>
                    </div>
                    <span class="grow text-center">
                        {{ matchup.record.wins }}
                    </span>
                    <span class="grow text-center">
                        {{ matchup.record.losses }}
                    </span>
                </div>
            </div>
            <h1 class="text-xl font-unbounded font-semibold mb-2.5">Match History</h1>
            <div
                class="flex flex-col items-center w-full overflow-scroll bg-opacity-0 min-h-[300px]"
            >
                <div class="flex flex-col gap-[0.625rem] w-full">
                    <MatchHistoryCard
                        v-for="(match, i) of matchHistory"
                        :key="i"
                        :match="match"
                        :user="user"
                        class="animate-fadeIn"
                    >
                        {{ getEloDifference(userSoloTeamId ?? '', match, matchHistory[i + 1]) }}
                    </MatchHistoryCard>
                </div>
            </div>
        </div>
    </Layout>
</template>
<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue'
import Layout from '@/components/layouts/Layout.vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { computed, onMounted, ref } from 'vue'
import type { Match } from '@/types/match'
import { useMatchStore } from '@/stores/match'
import MatchHistoryCard from '@/components/MatchHistoryCard.vue'
import type { User } from '@/types/users'
import EloChart from '@/components/EloChart.vue'

const user = computed(() => userStore.user)
const userSoloTeamId = computed(
    () => userStore.user?.teams.find((team) => team.users.length === 1)?.id
)
const loading = ref(false)

const userStore = useUserStore()
const authStore = useAuthStore()
const matchStore = useMatchStore()

const matchHistory = ref<Match[]>([])

function isWinnerOfMatch(user: User, match: Match): boolean {
    return user.teams.map((team) => team.id).includes(match.winningTeamId)
}

function getEloDifference(teamId: string, match: Match, previousMatch: Match): string | void {
    if (!match || !previousMatch) return
    const currentElo = match.postMatchElos?.find((elo) => elo.teamId === teamId)?.elo
    const previousElo = previousMatch.postMatchElos?.find((elo) => elo.teamId === teamId)?.elo
    console.log({ currentElo, previousElo })
    if (!currentElo || !previousElo) return

    const diff = currentElo - previousElo

    return `${diff > 0 ? '+' : ''} ${diff}`
}

onMounted(async () => {
    try {
        loading.value = true
        await userStore.refreshUser()

        if (!user.value?.id) {
            return
        }

        matchHistory.value = await matchStore.getMatchesByStateAndUserId('COMPLETED', user.value.id)
        console.log({ matchHistory: matchHistory.value })
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
})
</script>
