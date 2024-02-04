import { defineStore } from 'pinia'
import type { Lobby, Match, MatchSetup, MatchState, UpdateMatchScoreDto } from '@/types/match'
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

    async function getMatchesByStateAndUserId(state: MatchState, userId: string): Promise<Match[]> {
        const res = await apiClient.get<Match[]>(`/match/state/${state}`, { params: { userId } })

        return res.data
    }

    async function getAllMatchesByState(state: MatchState): Promise<Match[]> {
        const res = await apiClient.get<Match[]>(`match/state/${state}`)

        return res.data
    }

    async function createMatch(match: MatchSetup): Promise<Match> {
        const res = await apiClient.post<Match>(`match`, match)

        return res.data
    }

    async function updateMatchScore(
        matchId: string,
        scoreData: UpdateMatchScoreDto
    ): Promise<void> {
        const res = await apiClient.patch(`match/${matchId}/score`, scoreData)

        return res.data
    }

    async function getAllOpenLobbies(): Promise<Lobby[]> {
        const res = await apiClient.get<Lobby[]>('match/lobbies')
        return res.data
    }

    async function joinLobby(matchId: string, teamInfo: { teamB: string[] }): Promise<Match> {
        const res = await apiClient.patch<Match>(`/match/${matchId}/join`, teamInfo)

        return res.data
    }

    async function deleteMatch(matchId: string): Promise<void> {
        const res = await apiClient.delete(`/match/${matchId}`)

        return res.data
    }

    return {
        createMatch,
        getAllOpenLobbies,
        joinLobby,
        getInProgressMatches,
        getMatch,
        updateMatchScore,
        getAllMatchesByState,
        deleteMatch,
        getMatchesByStateAndUserId
    }
})
