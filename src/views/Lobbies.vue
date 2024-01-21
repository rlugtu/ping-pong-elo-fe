<template>
    <main class="p-2">
        <LoadingScreen v-if="loading" class="mt-[40%]"></LoadingScreen>
        <div class="px-2" v-else>
            <div class="flex flex-col gap-2">
                <h1 class="text-xl text-slate-300 font-bold">My Live Matches</h1>
                <div v-for="(match, i) of inProgressMatches" :key="i">
                    <router-link :to="`match/${match.id}`">
                        <MatchCard :match="match" class="bg-gray-300 p-2 rounded"></MatchCard>
                    </router-link>
                </div>
            </div>
            <div class="flex flex-col gap-2 mt-6">
                <h1 class="text-xl text-slate-300 font-bold">Open Lobbies</h1>
                <div
                    class="bg-gray-500 pl-4 py-2 rounded flex items-center justify-between relative"
                    v-for="(lobby, i) of lobbies"
                    :key="i"
                >
                    <div>
                        <h2>{{ lobby.teamA.users[0].firstName }}'s Room</h2>
                        <h3>First to: {{ lobby.winningScore }}</h3>
                    </div>

                    <button
                        class="bg-blue-400 w-[100px] rounded rounded-l-none absolute right-0 h-full"
                        @click="toggleJoinLobby(lobby)"
                    >
                        Join
                    </button>
                </div>
            </div>
            <div class="absolute left-0 bottom-20 w-full flex justify-center">
                <button @click="toggleCreateMatch" class="bg-blue-400 w-[200px] p-4 rounded">
                    Create Match
                </button>
            </div>
            <Modal v-if="creatingMatch">
                <CreateMatch
                    class="mt-[20%] rounded"
                    @cancel="toggleCreateMatch"
                    @create="createMatch"
                ></CreateMatch>
            </Modal>
            <Modal v-if="joiningLobby && selectedLobby && user">
                <JoinLobby
                    class="mt-[20%] rounded"
                    :lobby="selectedLobby"
                    @cancel="cancelJoinLobby"
                    :user="user"
                    @join="joinMatch"
                ></JoinLobby>
            </Modal>
        </div>
    </main>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CreateMatch from '@/components/CreateMatch.vue'
import JoinLobby from '@/components/JoinLobby.vue'
import Modal from '@/components/Modal.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import MatchCard from '@/components/MatchCard.vue'
import { useMatchStore } from '@/stores/match'
import type { MatchSetup } from '@/types/match'
import { useUserStore } from '../stores/user'
import { type Match, type Lobby } from '../types/match'

const matchStore = useMatchStore()
const user = useUserStore().user

const loading = ref(true)
const lobbies = ref<Lobby[]>([])
const creatingMatch = ref(false)
const joiningLobby = ref(false)
const selectedLobby = ref<Lobby | null>(null)
const inProgressMatches = ref<Match[]>([])

function toggleCreateMatch(): void {
    creatingMatch.value = !creatingMatch.value
}

function toggleJoinLobby(lobby: Lobby): void {
    selectedLobby.value = lobby
    joiningLobby.value = true
}

function cancelJoinLobby(): void {
    selectedLobby.value = null
    joiningLobby.value = false
}

async function createMatch(match: MatchSetup): Promise<void> {
    try {
        if (user?.id) {
            match.teamA = [user.id]
        }
        await matchStore.createMatch(match)
    } catch (error) {
        console.log({ error })
    } finally {
        creatingMatch.value = false
    }
}

async function joinMatch(): Promise<void> {
    console.log(selectedLobby.value || !user)
    try {
        if (!selectedLobby.value || !user) {
            console.log(selectedLobby.value, user)
            return
        }
        const { id } = user

        const usersToAdd = selectedLobby.value.teamB?.users.map((user) => user.id) ?? []
        usersToAdd.push(id)

        await matchStore.joinLobby(selectedLobby.value.id, {
            teamB: usersToAdd
        })
    } catch (error) {
        console.log(error)
    } finally {
        cancelJoinLobby()
    }
}

onMounted(async () => {
    try {
        lobbies.value = await matchStore.getAllOpenLobbies()

        inProgressMatches.value = await matchStore.getInProgressMatches()
    } catch (error) {}
    loading.value = false
})
</script>
