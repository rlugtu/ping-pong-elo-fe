<template>
    <main>
        <LoadingScreen
            v-if="loading || match === null"
            class="flex justify-center mt-[40%]"
        ></LoadingScreen>
        <div v-else>
            <h1>Live Match</h1>

            <div class="flex flex-col items-center justify-center">
                <div>
                    <h2>Opposing Team</h2>
                    <h3>{{ match.teamA.elo }}</h3>
                    <div v-for="(user, i) in match.teamA.users" :key="i">
                        <p>{{ user.firstName }}</p>
                    </div>

                    <div class="flex gap-2 items-center">
                        <button
                            class="p-4 w-[100px]"
                            @click="updateTeamScore('a', 'subtract')"
                            :disabled="teamAScore <= 0"
                        >
                            -
                        </button>
                        <p>{{ teamAScore }}</p>
                        <button class="p-4 w-[100px]" @click="updateTeamScore('a', 'add')">
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <h2>User Team</h2>
                    <h3>{{ match.teamB.elo }}</h3>
                    <div v-for="(user, i) in match.teamA.users" :key="i">
                        <p>{{ user.firstName }}</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <button
                            class="p-4 w-[100px]"
                            @click="updateTeamScore('b', 'subtract')"
                            :disabled="teamBScore <= 0"
                        >
                            -
                        </button>
                        <p>{{ teamBScore }}</p>
                        <button
                            class="p-4 w-[100px]"
                            @click="updateTeamScore('b', 'add')"
                            :disabled="teamBScore >= match.winningScore"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div>
                    <button
                        class="w-[200px] bg-blue-500 rounded p-4 h-[50px] flex justify-center items-center"
                        @click="submitUpdateTeamScore(match.teamA.id, match.teamB.id)"
                    >
                        Submit Score
                    </button>
                </div>
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
