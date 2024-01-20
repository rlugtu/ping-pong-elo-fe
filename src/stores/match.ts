import { defineStore } from 'pinia'
import type { Lobby, Match, MatchSetup } from '@/types/match'
import apiClient from '@/api-client/api-client'

export const useMatchStore = defineStore('match', () => {
    async function createMatch(match: MatchSetup): Promise<Match> {
        const res = await apiClient.post<Match>('/match', match)

        return res.data
    }

    async function getMatch(id: string): Promise<Match> {
        const res = await apiClient.get<Match>(`/match/${id}`)

        return res.data
    }

    async function getAllOpenLobbies(): Promise<Lobby[]> {
        const res = await apiClient.get<Lobby[]>('/match/lobbies')

        return res.data
    }

    async function getCurrentInProgressMatches(): Promise<Match[]> {
        const res = await apiClient.get<Match[]>('/match/in-progress')

        return res.data
    }

    async function joinLobby(matchId: string, teamInfo: { teamB: string[] }): Promise<Match> {
        const res = await apiClient.patch<Match>(`/match/${matchId}/join`, teamInfo)

        return res.data
    }

    return { createMatch, getAllOpenLobbies, joinLobby, getCurrentInProgressMatches, getMatch }
})
