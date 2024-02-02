<template>
    <div class="text-gray-300 w-full">
        <h1 class="text-2xl font-bold text-orange-500">You've been challenged!</h1>
        <div class="flex justify-between items-center">
            <h2 class="text-lg">{{ matchChallenge.challenger.firstName }}</h2>
            <span class="txt-lg">{{ matchChallenge.challenger.elo }}</span>
        </div>
        <div class="mt-6">
            <h2 class="text-2xl">Match Details</h2>
            <p>{{ matchChallenge.matchInfo.mode }}</p>
            <p>First to {{ matchChallenge.matchInfo.winningScore }}</p>
        </div>
        <div class="mt-6 flex items-center gap-4">
            <button @click="rejectChallenge" class="p-4 bg-red-500 rounded w-full">Decline</button>
            <button class="p-4 bg-blue-500 rounded w-full" @click="acceptChallenge">Accept</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { notifyParticipantsOnMatchProgress, refreshOpenLobbies, socket } from '@/socket'
import { useMatchStore } from '@/stores/match'
import { useUserStore } from '@/stores/user'
import type { MatchChallenge } from '@/types/match'
import { computed } from 'vue'

const { matchChallenge } = defineProps<{
    matchChallenge: MatchChallenge
}>()

const userStore = useUserStore()
const matchStore = useMatchStore()

const userId = computed(() => userStore.user?.id)

async function acceptChallenge(): Promise<void> {
    try {
        if (!userId.value) {
            return
        }
        const matchId = matchChallenge.matchInfo.id
        const match = await matchStore.joinLobby(matchId, {
            teamB: [userId.value]
        })

        refreshOpenLobbies()
        notifyParticipantsOnMatchProgress([matchChallenge.challenger.id])

        socket.emit('clearUserChallengeRequest', {
            userId: userId.value
        })

        router.push(`/match/${match.id}`)
    } catch (error) {}
}

async function rejectChallenge(): Promise<void> {
    try {
        await matchStore.deleteMatch(matchChallenge.matchInfo.id)

        socket.emit('clearUserChallengeRequest', {
            userId: userId.value
        })
    } catch (error) {}
}
</script>
