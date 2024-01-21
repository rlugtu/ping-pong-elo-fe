<template>
    <div class="p-4 text-white">
        <h1 class="text-3xl font-bold">Create Match</h1>
        <div class="mt-8 grid grid-cols-2">
            <h1 class="col-span-2 text-center mb-4 text-xl font-semibold">Mode</h1>
            <button
                class="col-span-1 h-12"
                :class="matchSetup.mode === 'SINGLES' && 'rounded bg-blue-600'"
                @click="setMatchMode('SINGLES')"
            >
                1v1
            </button>
            <button
                class="col-span-1 h-12"
                :class="matchSetup.mode === 'DOUBLES' && 'rounded bg-blue-600'"
                @click="setMatchMode('DOUBLES')"
            >
                2v2
            </button>
        </div>
        <div class="mt-12 grid grid-cols-2">
            <h1 class="col-span-2 text-center mb-4 font-semibold text-xl">Set Winning Score</h1>
            <button
                class="col-span-1 h-12"
                :class="matchSetup.winningScore === 11 && 'rounded bg-blue-600'"
                @click="setWinningScore(11)"
            >
                11
            </button>
            <button
                class="col-span-1 h-12"
                :class="matchSetup.winningScore === 21 && 'rounded bg-blue-600'"
                @click="setWinningScore(21)"
            >
                21
            </button>
        </div>
        <div class="mt-16 grid grid-cols-2 h-12 gap-4">
            <button class="bg-red-500 rounded" @click="cancel">Cancel</button>
            <button class="bg-green-500 rounded" @click="submitCreateMatch">Create</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { type MatchWinningScore, type MatchSetup, type MatchMode } from '../types/match'

const matchSetup = ref<MatchSetup>({
    teamA: [],
    winningScore: 11,
    mode: 'SINGLES'
})

const emit = defineEmits<{
    (e: 'create', match: MatchSetup): void
    (e: 'cancel'): void
}>()

function cancel(): void {
    emit('cancel')
}

function setWinningScore(score: MatchWinningScore): void {
    matchSetup.value.winningScore = score
}

function setMatchMode(mode: MatchMode): void {
    matchSetup.value.mode = mode
}

function submitCreateMatch(): void {
    emit('create', matchSetup.value)
}
</script>
