import { defineStore } from 'pinia'
import type { Lobby, Match, MatchScoreData, MatchSetup, MatchState } from '@/types/match'
import { API_SERVER } from '@/utils/globals'
import { useAuthStore } from './auth'
import axios from 'axios'

export const useMatchStore = defineStore('match', () => {
    const authStore = useAuthStore()

    async function getMatch(id: string): Promise<Match> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.get<Match>(`${API_SERVER}/match/${id}`, authHeader)

        return res.data
    }

    async function getInProgressMatches(): Promise<Match[]> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.get<Match[]>(`${API_SERVER}/match/in-progress`, authHeader)

        return res.data
    }

    async function getAllMatchesByState(state: MatchState): Promise<Match[]> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.get<Match[]>(`${API_SERVER}/match/state/${state}`, authHeader)

        return res.data
    }

    async function createMatch(match: MatchSetup): Promise<Match> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.post<Match>(`${API_SERVER}/match`, match, authHeader)

        return res.data
    }

    async function updateMatchScore(matchId: string, scoreData: MatchScoreData): Promise<void> {
        const authHeader = await authStore.getAuthHeader()

        const res = await axios.patch(`${API_SERVER}/match/${matchId}/score`, scoreData, authHeader)

        return res.data
    }

    async function getAllOpenLobbies(): Promise<Lobby[]> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.get<Lobby[]>(`${API_SERVER}/match/lobbies`, authHeader)

        return res.data
    }

    async function joinLobby(matchId: string, teamInfo: { teamB: string[] }): Promise<Match> {
        const authHeader = await authStore.getAuthHeader()
        const res = await axios.patch<Match>(
            `${API_SERVER}/match/${matchId}/join`,
            teamInfo,
            authHeader
        )

        return res.data
    }

    return {
        createMatch,
        getAllOpenLobbies,
        joinLobby,
        getInProgressMatches,
        getMatch,
        updateMatchScore,
        getAllMatchesByState
    }
})
