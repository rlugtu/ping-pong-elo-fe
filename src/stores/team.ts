import { defineStore } from 'pinia'
import type { Team, TeamQueryParams } from '@/types/team'
import { API_SERVER } from '@/utils/globals'
import { useAuthStore } from './auth'
import apiClient from '@/api-client/api-client'
import type { Elo } from '@/types/elo'

export const useTeamStore = defineStore('team', () => {
    async function getTeamsByElo(qp: TeamQueryParams): Promise<Team[]> {
        const authHeader = await useAuthStore().getAuthHeader()
        const res = await apiClient.get<Team[]>(`${API_SERVER}/team`, {
            ...authHeader,
            params: qp
        })

        return res.data
    }

    async function getEloHistory(teamId: string): Promise<Elo[]> {
        const authHeader = await useAuthStore().getAuthHeader()
        const res = await apiClient.get<Elo[]>(`${API_SERVER}/team/${teamId}/elo`, {
            ...authHeader
        })

        return res.data
    }

    return {
        getTeamsByElo,
        getEloHistory
    }
})
