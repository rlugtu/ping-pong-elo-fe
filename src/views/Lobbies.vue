<template>
    <TableLayout>
        <template v-slot:top>
            <LoadingScreen v-if="loading || !user" class="mt-[30vh]"></LoadingScreen>
            <div v-else class="flex flex-col gap-2">
                <h1 class="text-xl font-unbounded font-semibold mb-2.5">My Live Matches</h1>
                <div v-for="(match, i) of inProgressMatches" :key="i">
                    <router-link :to="`match/${match.id}`">
                        <MatchCard :match="match" :user="user" class="border border-blue-500 rounded-lg"></MatchCard>
                    </router-link>
                </div>
            </div>
        </template>
        <template v-slot:bottom>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between">
                    <h1 class="text-xl font-unbounded font-semibold mb-2.5">Open Lobbies</h1>
                    <button @click="toggleCreateMatch" class="text-sm text font-bold opacity-60">
                        Create
                    </button>
                </div>
                <div class="border border-orange-500 pl-4 py-2 rounded flex items-center justify-between relative text-slate-300"
                    v-for="(lobby, i) of lobbies" :key="i">
                    <div>
                        <h2>{{ lobby.teamA.users[0].firstName }}'s Room</h2>
                        <h3>First to: {{ lobby.winningScore }}</h3>
                    </div>

                    <button v-if="isLobbyOwner(lobby, user.id)"
                        class="bg-orange-500 w-[100px] rounded rounded-l-none absolute right-0 h-full text-white font-bold"
                        @click="cancelLobby(lobby.id)">
                        Cancel
                    </button>
                    <button v-else
                        class="bg-orange-500 w-[100px] rounded rounded-l-none absolute right-0 h-full text-white font-bold"
                        @click="toggleJoinLobby(lobby)">
                        Join
                    </button>
                </div>
            </div>
            <Modal v-if="creatingMatch">
                <CreateMatch class="mt-[20%] rounded" @cancel="toggleCreateMatch" @create="createMatch"></CreateMatch>
            </Modal>
            <Modal v-if="joiningLobby && selectedLobby && user">
                <JoinLobby class="mt-[20%] rounded" :lobby="selectedLobby" @cancel="toggleOffJoiningLobby" :user="user"
                    @join="joinMatch"></JoinLobby>
            </Modal>
        </template>
    </TableLayout>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import CreateMatch from '@/components/CreateMatch.vue'
import JoinLobby from '@/components/JoinLobby.vue'
import Modal from '@/components/Modal.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'
import TableLayout from '@/components/layouts/TableLayout.vue'
import MatchCard from '@/components/MatchCard.vue'
import { useMatchStore } from '@/stores/match'
import type { MatchSetup } from '@/types/match'
import { useUserStore } from '../stores/user'
import { type Lobby } from '../types/match'
import { notifyParticipantsOnMatchProgress, refreshOpenLobbies, socket, state } from '@/socket'
import router from '@/router'

const matchStore = useMatchStore()
const user = computed(() => {
    return useUserStore().user
})

const loading = ref(false)
const lobbies = computed<Lobby[]>(() => state.lobbies)
const creatingMatch = ref(false)
const joiningLobby = ref(false)
const selectedLobby = ref<Lobby | null>(null)
const inProgressMatches = computed(() => state.inProgressMatches)

function toggleCreateMatch(): void {
    creatingMatch.value = !creatingMatch.value
}

function toggleJoinLobby(lobby: Lobby): void {
    selectedLobby.value = lobby
    joiningLobby.value = true
}

function toggleOffJoiningLobby(): void {
    selectedLobby.value = null
    joiningLobby.value = false
}

function isLobbyOwner(lobby: Lobby, userId: string): boolean {
    return lobby.teamA.users.some((user) => user.id === userId)
}

async function createMatch(match: MatchSetup): Promise<void> {
    try {
        if (user.value?.id) {
            match.teamA = [user.value.id]
        }
        await matchStore.createMatch(match)
        refreshOpenLobbies()
    } catch (error) {
        console.log({ error })
    } finally {
        creatingMatch.value = false
    }
}

async function joinMatch(): Promise<void> {
    try {
        if (!selectedLobby.value || !user.value) {
            return
        }

        const { id } = user.value

        const usersToAdd = selectedLobby.value.teamB?.users.map((user) => user.id) ?? []

        usersToAdd.push(id)

        await matchStore.joinLobby(selectedLobby.value.id, {
            teamB: usersToAdd
        })

        refreshOpenLobbies()

        // Update UI of other participants
        // Note: should be both teamA and teamB. Use match instead
        const otherParticipants = selectedLobby.value.teamA.users
            .filter((user) => user.id !== id)
            .map((user) => user.id)

        notifyParticipantsOnMatchProgress(otherParticipants)
        router.push(`/match/${selectedLobby.value.id}`)
    } catch (error) {
        console.log(error)
    } finally {
        toggleOffJoiningLobby()
    }
}

async function cancelLobby(matchId: string): Promise<void> {
    try {
        await matchStore.deleteMatch(matchId)
        refreshOpenLobbies()
    } catch (error) { }
}

onMounted(() => {
    const userId = useUserStore().user?.id
    if (userId) {
        socket.emit('getInProgressMatchesByUserIdRequest', {
            userId
        })
    }
    if (socket.id) {
        socket.emit('getLobbiesRequestByClient', {
            socketId: socket.id
        })
    }
})
</script>
