import type { MatchMode } from './match'
import type { User } from './users'
import type { Season } from './season'

export interface Team {
    id: string
    users: User[]
    elo: number
    completedSeasonPlacements: boolean
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

export type TeamRecordSummary = {
    wins: number
    losses: number
}

export type TeamHeadToHeadRecord = TeamRecordSummary & {
    userNames: string[]
}

export type TeamHeadToHead = {
    teamId: string
    record: TeamHeadToHeadRecord
}

export type TeamPerformanceSummary = {
    totalWins: number
    totalLosses: number
    bySeason: TeamRecordSummary & {
        season: Season
    }
    headToHeads: TeamHeadToHead[]
}
