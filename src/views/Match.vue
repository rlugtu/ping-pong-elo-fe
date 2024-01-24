<template>
    <main class="p-2">
        <LoadingScreen v-if="loading || match === null" class="mt-[30vh]"></LoadingScreen>
        <div v-else class="text-slate-300 pb-[70px] full touch-manipulation">
            <h1 class="text-3xl text-gray-300">Live Match</h1>
            <div class="grid grid-rows-5 p-2 w-full">
                <div
                    class="flex flex-col justify-center items-centers row-span-2"
                    v-if="opposingTeam"
                >
                    <div class="flex justify-between pb-4 border-b border-b-orange-500">
                        <div v-for="(user, i) in opposingTeam.users" :key="i">
                            <p class="text-2xl">{{ user.firstName }}</p>
                        </div>
                        <h3 class="text-xl">
                            {{ opposingTeam.elo }}
                        </h3>
                    </div>

                    <div class="grid grid-cols-3 mt-12">
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-orange-600 text-3xl text-orange-600 col-span-1 justify-self-center"
                            @click="updateTeamScore(opposingTeam, 'subtract')"
                            :disabled="opposingTeam.score <= 0"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="
                                opposingTeam.score >= match.winningScore &&
                                'animate-bounce text-green-500'
                            "
                        >
                            {{ opposingTeam.score }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            @click="updateTeamScore(opposingTeam, 'add')"
                            :disabled="opposingTeam.score >= match.winningScore"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div
                    class="row-span-1 flex justify-center items-center text-xl font-bold text-slate-300"
                >
                    VS
                </div>

                <div class="flex flex-col justify-center items-centers row-span-2" v-if="userTeam">
                    <div class="grid grid-cols-3">
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-orange-600 text-3xl text-orange-600 col-span-1 justify-self-center"
                            @click="updateTeamScore(userTeam, 'subtract')"
                            :disabled="userTeam.score <= 0"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="[
                                userTeam.score >= match.winningScore &&
                                    'animate-bounce text-green-500'
                            ]"
                        >
                            {{ userTeam.score }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            @click="updateTeamScore(userTeam, 'add')"
                            :disabled="userTeam.score >= match.winningScore"
                        >
                            +
                        </button>
                    </div>

                    <div class="mt-12 flex justify-between border-t border-t-blue-500 pt-4">
                        <h3 class="text-xl">
                            {{ userTeam?.elo }}
                        </h3>
                        <div class="px-4 pb-4">
                            <div v-for="(user, i) in userTeam?.users" :key="i">
                                <p class="text-2xl">{{ user.firstName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center items-center">
                <button
                    class="w-[200px] mt-4 bg-blue-500 rounded p-4 h-[50px] flex justify-center items-center"
                    @click="submitUpdateTeamScore()"
                >
                    Submit Score
                </button>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { Match } from '@/types/match'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { onMounted, ref } from 'vue'
import { useMatchStore } from '@/stores/match'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { MatchTeam } from '@/types/team'
import { useUserStore } from '@/stores/user'
const matchStore = useMatchStore()
const userStore = useUserStore()

const loading = ref(false)
const match = ref<Match | null>(null)
const userTeam = ref<MatchTeam>()
const opposingTeam = ref<MatchTeam>()

function assignTeamSides(match: Match): void {
    const userExistsInTeamA = match.teamA.users.find((user) => {
        return user.id === userStore.user?.id
    })

    userTeam.value = userExistsInTeamA ? match.teamA : match.teamB
    opposingTeam.value = userExistsInTeamA ? match.teamB : match.teamA
}

function updateTeamScore(team: MatchTeam, action: 'add' | 'subtract'): void {
    team.score = action === 'add' ? team.score + 1 : team.score - 1
}

// Temp function will be replaced when web sockets introduced
async function submitUpdateTeamScore(): Promise<void> {
    try {
        loading.value = true
        if (!match.value) {
            return
        }

        const matchScore = {
            teamA: {
                id: match.value.teamA.id,
                score: match.value.teamA.score
            },
            teamB: {
                id: match.value.teamB.id,
                score: match.value.teamB.score
            }
        }

        await matchStore.updateMatchScore(match.value.id, matchScore)
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    try {
        loading.value = true
        const route = useRoute()
        const matchId = route.params['id']

        // gross, fix match id type
        if (!matchId || typeof matchId !== 'string') {
            router.push('/')
            return
        }

        match.value = await matchStore.getMatch(matchId)

        assignTeamSides(match.value)
    } catch (error) {
        console.log({ error })
    } finally {
        loading.value = false
    }
})
</script>
