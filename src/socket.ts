import { reactive } from 'vue'
import { Socket, io } from 'socket.io-client'
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

    const user = useUserStore().user

    if (user && socket.id) {
        socketSetup(user.id, socket.id)
    }

    for (const matchId in state.matches) {
        socket.emit('joinMatch', {
            socketId: socket.id,
            matchId
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
    socket.emit('getInProgressMatchesByUserIdRequest', {
        userId,
        socketId: socket.id
    })
})

export function socketSetup(userId: string, socketId: string): void {
    socket.emit('newConnection', {
        userId,
        socketId
    })

    socket.emit('getLobbiesRequestByClient', {
        socketId
    })

    socket.emit('getInProgressMatchesByUserIdRequest', {
        userId
    })
}

export function joinMatchSocket(matchId: string, socket: Socket) {
    socket.emit('joinMatch', {
        socketId: socket.id,
        matchId
    })
}
