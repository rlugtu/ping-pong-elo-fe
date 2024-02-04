<template>
    <main class="p-2 flex flex-col justify-center text-slate-300">
        <div class="flex justify-end">
            <router-link to="/user-setup">
                <font-awesome-icon icon="fa-solid fa-gear" class="text-3xl mr-4" />
            </router-link>
        </div>
        <div class="mx-auto flex flex-col justify-center items-center">
            <div
                class="border border-gray-300 rounded-full w-[150px] h-[150px] flex flex-col justify-center items-center mt-4"
            >
                <font-awesome-icon icon="fa-solid fa-user" class="text-7xl" />
            </div>
            <h1 class="mt-4">{{ user?.firstName }} {{ user?.lastName }}</h1>
            <h1 v-if="user?.department" class="text-xs mt">{{ user.department }}</h1>
        </div>
        <LoadingScreen
            v-if="loading || !user"
            class="mt-24 flex justify-center items-center"
        ></LoadingScreen>
        <div v-else class="animate-fadeIn">
            <div class="mt-6 min-h-[100px]">
                <h1 class="text-2xl font-bold mb-2">My Teams</h1>
                <div
                    v-for="(team, i) of user?.teams"
                    :key="i"
                    class="flex justify-between py-2 border-t"
                >
                    <div v-for="(user, i) of team.users" :key="i">
                        <template v-if="team.users.length === 1">
                            <p>Solo</p>
                        </template>
                        <p v-else>{{ user.firstName }} {{ user.lastName }}</p>
                    </div>
                    <span>{{ team.elo }}</span>
                </div>
            </div>
            <div class="mt-6 min-h-[100px]">
                <h1 class="text-2xl font-bold">Match History</h1>
                <div class="flex flex-col gap-2 mt-4">
                    <MatchHistoryCard
                        v-for="(match, i) of matchHistory"
                        :key="i"
                        :match="match"
                        :user="user"
                    ></MatchHistoryCard>
                </div>
            </div>
            <button
                @click="authStore.handleLogout"
                class="bg-red-500 w-[150px] rounded-xl p-4 mx-auto mt-6"
            >
                Logout
            </button>
        </div>
    </main>
</template>
<script setup lang="ts">
import LoadingScreen from '@/components/LoadingScreen.vue'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'
import { computed, onMounted, ref } from 'vue'
import type { Match } from '@/types/match'
import { useMatchStore } from '@/stores/match'
import MatchHistoryCard from '@/components/MatchHistoryCard.vue'
import type { User } from '@/types/users'

const user = computed(() => userStore.user)
const loading = ref(false)

const userStore = useUserStore()
const authStore = useAuthStore()
const matchStore = useMatchStore()

const matchHistory = ref<Match[]>([])

function isWinnerOfMatch(user: User, match: Match): boolean {
    return user.teams.map((team) => team.id).includes(match.winningTeamId)
}

onMounted(async () => {
    try {
        loading.value = true
        await userStore.refreshUser()

        if (!user.value?.id) {
            return
        }

        matchHistory.value = await matchStore.getMatchesByStateAndUserId('COMPLETED', user.value.id)
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
})
</script>
