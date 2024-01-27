<template>
    <div class="p-4 text-gray-300">
        <h2 class="text-2xl">First to {{ lobby.winningScore }}</h2>
        <div class="mt-4">
            <h2 class="text-xl mb-4">Opposing Team</h2>
            <div
                v-for="(user, i) in lobby.teamA.users"
                :key="i"
                class="flex flex-col justify-between items-center border rounded-lg"
            >
                <div class="mt-4">
                    <div
                        class="border border-gray-300 rounded-full w-[90px] h-[90px] flex flex-col justify-center items-center mt-4"
                    >
                        <font-awesome-icon icon="fa-solid fa-user" class="text-5xl" />
                    </div>
                </div>
                <div class="mt-6 flex justify-between w-full border-t p-2">
                    <p>
                        {{ user.firstName }}
                        {{ user.lastName }}
                    </p>
                    <span>
                        {{ lobby.teamA.elo }}
                    </span>
                </div>
            </div>
            <p></p>
            <!-- <div class="flex justify-center">VS</div>
            <div class="flex justify-between items-center">
                <div>
                    <h1>{{ user.firstName }}</h1>
                    <h1>{{ user.department }}</h1>
                </div>
                <div></div>
            </div> -->
        </div>

        <div class="mt-8 grid grid-cols-2 h-12 gap-4 text-white font-bold">
            <button @click="leaveLobby" class="bg-red-500 rounded">Leave</button>
            <button class="bg-green-500 rounded" @click="joinMatch(lobby.id)">Join</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { User } from '@/types/users'

import { type Lobby } from '../types/match'
interface LobbyConfig {
    lobby: Lobby
    user: User
}

const emit = defineEmits<{
    (e: 'join', matchId: string): void
    (e: 'cancel'): void
}>()

function leaveLobby(): void {
    emit('cancel')
}

function joinMatch(lobbyId: string) {
    emit('join', lobbyId)
}

const { lobby, user } = defineProps<LobbyConfig>()
</script>
