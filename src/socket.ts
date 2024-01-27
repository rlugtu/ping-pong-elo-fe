import { reactive } from 'vue'
import { io } from 'socket.io-client'
import { API_SERVER } from './utils/globals'
import type { Lobby } from './types/match'

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
}>({
    connected: false,
    matches: {},
    lobbies: []
})

const URL = API_SERVER

export const socket = io(URL)
socket.on('connect', () => {
    console.log('connected to socket')
    state.connected = true
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
