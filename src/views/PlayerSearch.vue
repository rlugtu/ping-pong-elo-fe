<template>
    <div class="w-full px-2 animate-fadeIn">
        <!-- <div class="w-full flex items-end">
            <input
                type="text"
                placeholder="Search"
                class="px-2 w-[80%] bg-transparent border-b border-b-orange-500 outline-none text-orange-500 text-xl placeholder-orange-500"
            />
            <button class="bg-orange-500 h-full p-4 w-[20%] text-white font-bold">Search</button>
        </div> -->
        <LoadingScreen
            v-if="loading"
            class="h-[500px] flex justify-center items-center"
        ></LoadingScreen>
        <div class="animate-fadeIn" v-else>
            <h2 class="text-3xl text-blue-500">Players</h2>
            <div
                v-for="(user, i) in users"
                :key="i"
                class="p-2 text-blue-400 flex items-center justify-between border-b border-b-blue-500 py-4"
            >
                <div class="flex flex-col">
                    <h1>{{ user.firstName }} {{ user.lastName }}</h1>
                </div>
                <div class="flex gap-4">
                    <button
                        class="border border-blue-500 rounded py-2 px-4"
                        @click="selectOpponent(user)"
                    >
                        Challenge
                    </button>
                    <button class="border border-orange-500 text-orange-500 rounded px-4">
                        Visit
                    </button>
                </div>
            </div>
        </div>

        <Modal v-if="opponentToChallenge">
            <div class="mt-[20%]">
                <CreateMatch
                    class="rounded"
                    :lobby="challengeMatch"
                    @create="createChallengeMatch(challengeMatch, opponentToChallenge)"
                    @cancel="hideChallengeModal"
                >
                    <h1 class="text-2xl text-orange-500 mt-4">
                        Challenge {{ opponentToChallenge.firstName }}
                    </h1></CreateMatch
                >
            </div>
        </Modal>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import CreateMatch from '@/components/CreateMatch.vue'
import Modal from '@/components/Modal.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/users'
import type { MatchChallenge, MatchSetup } from '@/types/match'
import { useMatchStore } from '@/stores/match'
import { socket } from '@/socket'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const matchStore = useMatchStore()

const loading = ref(false)
const users = ref<User[]>([])
const opponentToChallenge = ref<User | null>(null)

const challengeMatch = ref<MatchSetup>({
    teamA: [],
    teamB: null,
    winningScore: 11,
    mode: 'SINGLES'
})

function selectOpponent(user: User): void {
    opponentToChallenge.value = user
}
function hideChallengeModal(): void {
    opponentToChallenge.value = null
}

async function createChallengeMatch(match: MatchSetup, opponent: User): Promise<void> {
    try {
        if (!user.value?.id) {
            return
        }
        match.teamA = [user.value.id]
        match.teamB = [opponent.id]

        const createdMatch = await matchStore.createMatch(match)

        // send match request to oopponent
        const matchChallengeRequest: MatchChallenge = {
            challenger: {
                firstName: user.value.firstName,
                elo: 1200,
                id: user.value.id
            },
            challengeeUserId: opponent.id,
            matchInfo: {
                id: createdMatch.id,
                winningScore: createdMatch.winningScore,
                mode: createdMatch.mode
            }
        }

        socket.emit('challengeMatchRequest', matchChallengeRequest)

        // router.push(`/match/${createdMatch.id}`)
        //emit to opponent socket
    } catch (error) {
        console.log({ error })
    } finally {
        hideChallengeModal()
    }
}

onMounted(async () => {
    try {
        loading.value = true
        const data = await userStore.getAllUsers()

        users.value = data
    } catch (error) {
    } finally {
        loading.value = false
    }
})
</script>
