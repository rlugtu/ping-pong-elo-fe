<template>
    <Layout>
        <!-- <div class="w-full flex items-end">
            <input
                type="text"
                placeholder="Search"
                class="px-2 w-[80%] bg-transparent border-b border-b-orange-500 outline-none text-orange-500 text-xl placeholder-orange-500"
            />
            <button class="bg-orange-500 h-full p-4 w-[20%] text-white font-bold">Search</button>
        </div> -->
        <h1 class="text-xl font-unbounded font-semibold mb-2.5">Players</h1>
        <LoadingScreen v-if="loading" class="h-[500px] flex justify-center items-center"></LoadingScreen>
        <div v-else class="flex flex-col gap-[0.625rem] overflow-scroll rounded-lg">
            <div v-for="(user, i) in users" :key="i"
                class="flex justify-between items-center rounded-lg bg-[#3557FC] px-2 py-3">
                <div class="flex flex-col">
                    <h1>{{ user.firstName }} {{ user.lastName }}</h1>
                </div>
                <div class="flex gap-2.5">
                    <button class="bg-[#FF7C4D] btn-shadow rounded-lg p-2" @click="selectOpponent(user)">
                        Challenge
                    </button>
                    <!-- <button class="bg-gray-100 text-gray-900 rounded-lg p-2">
                        Visit
                    </button> -->
                </div>
            </div>
        </div>

        <Modal v-if="opponentToChallenge">
            <div class="mt-[20%]">
                <CreateMatch class="rounded" @create="createChallengeMatch($event, opponentToChallenge)"
                    @cancel="hideChallengeModal">
                    <h1 class="text-2xl text-orange-500 mt-4">
                        Challenge {{ opponentToChallenge.firstName }}
                    </h1>
                </CreateMatch>
            </div>
        </Modal>
    </Layout>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import CreateMatch from '@/components/CreateMatch.vue'
import Modal from '@/components/Modal.vue'
import Layout from '@/components/layouts/Layout.vue'
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

// const challengeMatch = ref<MatchSetup>({
//     teamA: [],
//     teamB: null,
//     winningScore: 11,
//     mode: 'SINGLES'
// })

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

<style>
.btn-shadow {
    box-shadow: 0px 0px 0px 1px rgba(224, 34, 34, 0.76), 0px 1px 2px 0px rgba(80, 47, 42, 0.12);
}
</style>
