<template>
    <main class="p-2">
        <LoadingScreen
            v-if="loading || !match || !userTeam || !opposingTeam"
            class="mt-[30vh]"
        ></LoadingScreen>

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
                            :disabled="opposingTeamScore <= 0"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="[
                                opposingTeamScore >= match.winningScore &&
                                    'animate-bounce text-green-500'
                            ]"
                        >
                            {{ opposingTeamScore ?? 0 }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            :disabled="opposingTeamScore >= match.winningScore"
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
                            :disabled="userTeamScore <= 0"
                            @click="updateScore(match.id, userTeam.id, userTeamScore - 1)"
                        >
                            -
                        </button>
                        <p
                            class="p-4 w-[75px] h-[75px] flex justify-center items-center text-4xl justify-self-center"
                            :class="[
                                userTeamScore >= match.winningScore &&
                                    'animate-bounce text-green-500'
                            ]"
                        >
                            {{ userTeamScore ?? 0 }}
                        </p>
                        <button
                            class="p-4 w-[75px] h-[75px] border rounded-full border-blue-600 text-3xl text-blue-600 col-span-1 justify-self-center"
                            @click="updateScore(match.id, userTeam.id, userTeamScore + 1)"
                            :disabled="userTeamScore >= match.winningScore"
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
            <div class="flex justify-center items-center gap-2">
                <button
                    class="w-[200px] mt-4 bg-blue-600 rounded p-4 h-[50px] flex justify-center items-center"
                    @click="submitMatchScores(match.id, userTeam, false)"
                >
                    Save Progress
                </button>
                <button
                    class="w-[200px] mt-4 bg-blue-600 rounded p-4 h-[50px] flex justify-center items-center"
                    @click="submitMatchScores(match.id, userTeam, true)"
                >
                    Submit Final
                </button>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { Match } from '@/types/match'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useMatchStore } from '@/stores/match'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { MatchTeam } from '@/types/team'
import { useUserStore } from '@/stores/user'
import { joinMatchSocket, socket, state } from '@/socket'

const matchStore = useMatchStore()
const userStore = useUserStore()

const loading = ref(false)

const match = ref<Match | null>(null)
const userExistsInTeamA = ref(false)

const userTeam = ref<MatchTeam>()
const userTeamScore = computed(() => {
    if (!match.value || !userTeam.value?.id) {
        return 0
    }

    return state.matches?.[match.value.id]?.scores[userTeam.value.id] ?? null
})

const opposingTeam = ref<MatchTeam>()
const opposingTeamScore = computed(() => {
    if (!match.value || !opposingTeam.value?.id) {
        return 0
    }

    return state.matches?.[match.value.id]?.scores[opposingTeam.value.id] ?? null
})

function updateScore(matchId: string, teamId: string, score: number): void {
    state.matches[matchId].scores[teamId] = score
    // state.matches[matchId].scores[teamId] = score

    socket.emit('matchScoreUpdateEvent', {
        matchId,
        matchRoomInfo: state.matches[matchId]
    })
}

// Temp function will be replaced when web sockets introduced
async function submitMatchScores(
    matchId: string,
    userTeam: MatchTeam,
    isFinalScore: boolean = false
): Promise<void> {
    try {
        loading.value = true

        await matchStore.updateMatchScore(matchId, {
            teamId: userTeam.id,
            score: state.matches[matchId].scores[userTeam.id],
            isFinalScore
        })
    } catch (error) {
        console.log(error)
    } finally {
        if (isFinalScore) {
            router.push('/')
        }
        loading.value = false
    }
}

function assignTeamSides(match: Match): void {
    const userIsTeamA = match.teamA.users.find((user) => {
        return user.id === userStore.user?.id
    })

    if (userIsTeamA) {
        userExistsInTeamA.value = true
        userTeam.value = match.teamA
        opposingTeam.value = match.teamB
    } else {
        userExistsInTeamA.value = false
        userTeam.value = match.teamB
        opposingTeam.value = match.teamA
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

        // join match socket
        joinMatchSocket(matchId, socket)
    } catch (error) {
        console.log({ error })
    } finally {
        loading.value = false
    }
})

onBeforeUnmount(async () => {
    // TEMP will decide later if we want to autoSave on leave
    // if (!!match.value && !!userTeam.value && !!opposingTeam.value) {
    //     await submitMatchScores(match.value.id, userTeam.value, opposingTeam.value)
    // }
    if (!match.value?.id) {
        return
    }

    socket.emit('leaveMatchRoom', {
        socketId: socket.id,
        matchId: match.value.id
    })
})
</script>
