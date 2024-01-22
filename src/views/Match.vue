<template>
    <main class="p-2">
        <LoadingScreen v-if="loading || match === null" class="mt-[30vh]"></LoadingScreen>
        <div v-else class="text-slate-300 pb-[50px]full">
            <h1 class="text-3xl text-gray-300">Live Match</h1>
            <div class="grid grid-rows-6 p-2 w-full">
                <div class="flex flex-col justify-center items-centers row-span-2">
                    <div class="flex justify-between pb-4 border-b border-b-orange-500">
                        <div v-for="(user, i) in match.teamA.users" :key="i">
                            <p class="text-2xl">{{ user.firstName }}</p>
                        </div>
                        <h3 class="text-xl">
                            {{ match.teamA.elo }}
                        </h3>
                    </div>

                    <div class="grid grid-cols-3 mt-12">
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-orange-600 text-3xl text-orange-600 col-span-1 justify-self-center"
                            @click="updateTeamScore('a', 'subtract')"
                            :disabled="teamAScore <= 0"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="
                                teamAScore >= match.winningScore && 'animate-bounce text-green-500'
                            "
                        >
                            {{ teamAScore }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            @click="updateTeamScore('a', 'add')"
                            :disabled="teamAScore >= match.winningScore"
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

                <div class="flex flex-col justify-center items-centers row-span-2">
                    <div class="grid grid-cols-3">
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-orange-600 text-3xl text-orange-600 col-span-1 justify-self-center"
                            @click="updateTeamScore('b', 'subtract')"
                            :disabled="teamBScore <= 0"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="[
                                teamBScore >= match.winningScore && 'animate-bounce text-green-500'
                            ]"
                        >
                            {{ teamBScore }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            @click="updateTeamScore('b', 'add')"
                            :disabled="teamBScore >= match.winningScore"
                        >
                            +
                        </button>
                    </div>

                    <div class="mt-12 flex justify-between border-t border-t-blue-500 pt-4">
                        <h3 class="text-xl">
                            {{ match.teamB.elo }}
                        </h3>
                        <div class="px-4 pb-4">
                            <div v-for="(user, i) in match.teamA.users" :key="i">
                                <p class="text-2xl">{{ user.firstName }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center items-center">
                <button
                    class="w-[200px] bg-blue-500 rounded p-4 h-[50px] flex justify-center items-center"
                    @click="submitUpdateTeamScore(match.teamA.id, match.teamB.id)"
                >
                    Submit Score
                </button>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { Match, MatchScoreData } from '@/types/match'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { onMounted, ref } from 'vue'
import { useMatchStore } from '@/stores/match'
import { useRoute } from 'vue-router'
import router from '@/router'
const matchStore = useMatchStore()

const loading = ref(false)
const match = ref<Match | null>(null)
const teamAScore = ref(match.value?.teamA.score ?? 0)
const teamBScore = ref(match.value?.teamB.score ?? 0)

function updateTeamScore(side: 'a' | 'b', action: 'add' | 'subtract'): void {
    if (side === 'a') {
        teamAScore.value = action === 'add' ? teamAScore.value + 1 : teamAScore.value - 1
    } else {
        teamBScore.value = action === 'add' ? teamBScore.value + 1 : teamBScore.value - 1
    }
}

// Temp function will be replaced when web sockets introduced
async function submitUpdateTeamScore(teamAId: string, teamBId: string): Promise<void> {
    try {
        loading.value = true
        if (!match.value) {
            return
        }
        const teamAScoreInfo: MatchScoreData = {
            teamId: teamAId,
            score: teamAScore.value
        }
        const teamBScoreInfo: MatchScoreData = {
            teamId: teamBId,
            score: teamBScore.value
        }
        await matchStore.updateMatchScore(match.value.id, teamAScoreInfo)
        await matchStore.updateMatchScore(match.value.id, teamBScoreInfo)
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
        teamAScore.value = match.value.teamA.score
        teamBScore.value = match.value.teamB.score
    } catch (error) {
        console.log({ error })
    } finally {
        loading.value = false
    }
})
</script>
