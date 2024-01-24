import type { Elo } from './elo'
import type { MatchMode } from './match'
import type { User } from './users'

export interface Team {
    id: string
    users: User[]
    elo: number
}

export type TeamMatchSide = 'teamA' | 'teamB'

export interface MatchTeam extends Team {
    id: string
    elo: number
    createdAt: Date
    updatedAt: Date
    users: User[]
    score: number
}

export interface TeamQueryParams {
    matchMode: MatchMode
    sort: 'asc' | 'desc'
    limit?: number
}

export interface MatchTeam extends Team {
    score: number
}
