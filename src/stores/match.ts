import { defineStore } from 'pinia'
import type { Lobby, Match, MatchSetup, MatchState, UpdateMatchScoreDto } from '@/types/match'
import axios from 'axios'
import apiClient from '@/api-client/api-client'

export const useMatchStore = defineStore('match', () => {
    async function getMatch(id: string): Promise<Match> {
        const res = await apiClient.get<Match>(`/match/${id}`)

        return res.data
    }

    async function getInProgressMatches(userId: string): Promise<Match[]> {
        const res = await apiClient.get<Match[]>(`/match/in-progress/user/${userId}`)

        return res.data
    }

    async function getAllMatchesByState(state: MatchState): Promise<Match[]> {
        const res = await apiClient.get<Match[]>(`match/state/${state}`)

        return res.data
    }

    async function createMatch(match: MatchSetup): Promise<Match> {
        const res = await axios.post<Match>(`match`, match)

        return res.data
    }

    async function updateMatchScore(
        matchId: string,
        scoreData: UpdateMatchScoreDto
    ): Promise<void> {
        const res = await axios.patch(`match/${matchId}/score`, scoreData)

        return res.data
    }

    async function getAllOpenLobbies(): Promise<Lobby[]> {
        const res = await axios.get<Lobby[]>('match/lobbies')

        return res.data
    }

    async function joinLobby(matchId: string, teamInfo: { teamB: string[] }): Promise<Match> {
        const res = await apiClient.patch<Match>(`/match/${matchId}/join`, teamInfo)

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
