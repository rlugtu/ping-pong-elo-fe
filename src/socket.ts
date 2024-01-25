import { reactive } from 'vue'
import { io } from 'socket.io-client'
import { API_SERVER } from './utils/globals'

export type SocketMatchRooms = {
    [roomId: string]: {
        [teamId: string]: number
    }
}

export const state = reactive<{
    connected: boolean
    matches: SocketMatchRooms
}>({
    connected: false,
    matches: {}
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

socket.on('matchScoreUpdated', (data: SocketMatchRooms) => {
    state.matches = { ...state.matches, ...data }
})
