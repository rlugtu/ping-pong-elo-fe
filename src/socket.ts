import { reactive } from 'vue'
import { Socket, io } from 'socket.io-client'
import { API_SERVER } from './utils/globals'
import type { Lobby, Match, MatchState } from './types/match'
import { useUserStore } from './stores/user'
import { useNotificationStore, type Notification } from './stores/notification'

export type SocketMatchRooms = {
    [matchId: string]: MatchRoomInfo
}

type MatchRoomInfo = {
    scores: {
        [teamId: string]: number
    }
    state: MatchState
    participants: string[] // string of userIds
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

// ** Watchers **
socket.on('connect', () => {
    console.log('connected to socket')
    state.connected = true

    const user = useUserStore().user
    if (!socket.id) {
        return
    }

    // ** Reconnect logic **
    // join general server
    if (user) {
        socketSetup(user.id, socket.id)
    }

    // join rooms
    for (const matchId in state.matches) {
        joinMatchSocket(matchId, socket)
    }
})

// server
socket.on('disconnect', () => {
    console.log('diconnected from socket')
    state.connected = false
})

// matches
socket.on('matchScoreUpdated', (data: { matchId: string; matchRoomInfo: MatchRoomInfo }) => {
    state.matches[data.matchId] = data.matchRoomInfo
})

socket.on('getLobbiesResponse', (data: Lobby[]) => {
    state.lobbies = data
})

// lobby in progress matches
socket.on('getInProgressMatchesByUserIdResponse', (matches: Match[]) => {
    state.inProgressMatches = matches
})

socket.on('shouldUpdateInProgressMatches', (userId: string) => {
    socket.emit('getInProgressMatchesByUserIdRequest', {
        userId,
        socketId: socket.id
    })
})

// NOTIFICATIONS
socket.on('notificationAlert', (notification: Notification) => {
    const notificationStore = useNotificationStore()

    notificationStore.notification = notification
})

// Helpers
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
