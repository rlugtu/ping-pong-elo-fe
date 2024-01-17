import { defineStore } from 'pinia'
import type { Lobby, Match, MatchSetup } from '@/types/match'
import { API_SERVER } from '@/utils/globals'
import { useAuthStore } from './auth'
import axios from 'axios'

export const useMatchStore = defineStore('match', () => {
    const authStore = useAuthStore()

    async function createMatch(match: MatchSetup): Promise<Match> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.post<Match>(`${API_SERVER}/match`, match, authHeader)

        return res.data
    }

    async function getAllOpenLobbies(): Promise<Lobby[]> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.get<Lobby[]>(`${API_SERVER}/match/lobbies`, authHeader)

        return res.data
    }

    async function joinLobby(matchId: string, playerInfo: { sideB: string[] }): Promise<Match> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.patch<Match>(
            `${API_SERVER}/match/${matchId}/join`,
            playerInfo,
            authHeader
        )

        return res.data
    }

    return { createMatch, getAllOpenLobbies, joinLobby }
})
