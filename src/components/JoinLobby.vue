<template>
    <div class="p-4">
        <h2>First to {{ lobby.winningScore }}</h2>
        <div class="mt-4">
            <div
                v-for="(user, i) in lobby.teamA.users"
                :key="i"
                class="flex justify-between items-center"
            >
                {{ user.firstName }}
                {{ user.lastName }}
            </div>
            <div class="flex justify-center">VS</div>
            <div class="flex justify-between items-center">
                <div>
                    <h1>{{ user.firstName }}</h1>
                    <h1>{{ user.department }}</h1>
                </div>
                <div></div>
            </div>
        </div>

        <div class="mt-8 grid grid-cols-2 h-12 gap-4">
            <button @click="leaveLobby" class="bg-red-500">Leave</button>
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
