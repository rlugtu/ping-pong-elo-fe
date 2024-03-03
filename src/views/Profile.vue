<template>
    <Layout>
        <div class="flex flex-col gap-3 items-center overflow-auto">
            <div class="flex flex-col gap-1 text-center">
                <p class="text-3xl text-medium font-unbounded">{{ user?.firstName }} {{ user?.lastName }}</p>
                <p class="text-lg text-gray-200" v-if="user?.department">{{ user.department }}</p>
                <p class="font-bold">{{ user?.elo }}</p>
            </div>
            <EloChart :team-id="userSoloTeamId" />
            <h1 class="text-xl font-unbounded font-semibold mb-2.5">Match History</h1>
            <div class="flex flex-col w-full overflow-scroll">
                <div class="flex flex-col gap-[0.625rem]">
                    <MatchHistoryCard v-for="(match, i) of matchHistory" :key="i" :match="match" :user="user">
                        {{ getEloDifference(userSoloTeamId ?? '', match, matchHistory[i + 1]) }}
                    </MatchHistoryCard>
                </div>
            </div>

            <button
                @click="authStore.handleLogout"
                class="bg-red-500 w-[150px] rounded-xl p-4 mx-auto mt-6"
            >
                Logout
            </button>
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
