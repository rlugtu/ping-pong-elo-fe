<template>
    <div class="px-2">
        <div class="flex flex-col gap-2">
            <h1 class="text-xl">Open Lobbies</h1>
            <div
                class="bg-gray-500 pl-4 py-2 rounded flex items-center justify-between relative"
                v-for="(lobby, i) of lobbies"
                :key="i"
            >
                <div>
                    <h2>{{ lobby.sideA[0].firstName }}'s Room</h2>
                    <h3>First to: {{ lobby.winningScore }}</h3>
                </div>

                <button
                    class="bg-blue-400 w-[100px] rounded absolute right-0 h-full"
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
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import CreateMatch from '@/components/CreateMatch.vue'
import JoinLobby from '@/components/JoinLobby.vue'
import Modal from '@/components/Modal.vue'
import { useMatchStore } from '@/stores/match'
import type { MatchSetup } from '@/types/match'
import { useUserStore } from '../stores/user'
import { type Lobby } from '../types/match'

const lobbies = ref<Lobby[]>([])

const creatingMatch = ref(false)
const joiningLobby = ref(false)
const selectedLobby = ref<Lobby | null>(null)

const matchStore = useMatchStore()

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

const user = useUserStore().user
async function createMatch(match: MatchSetup): Promise<void> {
    try {
        if (user?.id) {
            match.sideA = [user.id]
        }
        await matchStore.createMatch(match)
    } catch (error) {
        console.log({ error })
    } finally {
        creatingMatch.value = false
    }
}

async function joinMatch(): Promise<void> {
    try {
        if (!selectedLobby.value || !user) {
            console.log(selectedLobby.value, user)
            return
        }
        const { id, firstName, lastName, department, elo } = user
        selectedLobby.value.sideB = [{ id, firstName, lastName, department, elo }]
        const test = {
            sideB: [id]
        }
        await matchStore.joinLobby(selectedLobby.value.id, test)
    } catch (error) {
        console.log(error)
    } finally {
        cancelJoinLobby()
    }
}

onMounted(async () => {
    lobbies.value = await matchStore.getAllOpenLobbies()
})
</script>
