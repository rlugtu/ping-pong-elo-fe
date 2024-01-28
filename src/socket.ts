import { reactive } from 'vue'
import { io } from 'socket.io-client'
import { API_SERVER } from './utils/globals'
import type { Lobby, Match } from './types/match'
import { useUserStore } from './stores/user'

export type SocketMatchRooms = {
    [matchId: string]: {
        [teamId: string]: number
    }
}

export type SocketMatchScoreUpdate = {
    matchId: string
    scores: {
        [teamId: string]: number
    }
}

export const state = reactive<{
    connected: boolean
    matches: SocketMatchRooms
    lobbies: Lobby[]
    inProgressMatches: Match[]
}>({
    connected: false,
    matches: {},
    lobbies: [],
    inProgressMatches: []
})

const URL = API_SERVER

export const socket = io(URL)
socket.on('connect', () => {
    console.log('connected to socket')
    state.connected = true

    const userId = useUserStore().user?.id

    if (userId) {
        socket.emit('newConnection', {
            userId,
            socketId: socket.id
        })
    }
})

socket.on('disconnect', () => {
    console.log('diconnected from socket')
    state.connected = false
})

socket.on('matchScoreUpdated', (data: SocketMatchScoreUpdate) => {
    state.matches[data.matchId] = data.scores
})

socket.on('getLobbiesResponse', (data: Lobby[]) => {
    state.lobbies = data
})

// In Progress Matches
socket.on('getInProgressMatchesByUserIdResponse', (matches: Match[]) => {
    state.inProgressMatches = matches
})

socket.on('shouldUpdateInProgressMatches', (userId: string) => {
    socket.emit('getInProgressMatchesByUserIdRequest', userId)
})
