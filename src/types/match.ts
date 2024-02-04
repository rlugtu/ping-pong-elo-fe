import type { User } from '@auth0/auth0-vue'
import type { MatchTeam, Team } from './team'

export type MatchMode = 'SINGLES' | 'DOUBLES'

export const TEAM_SIZE_BY_MATCH_MODE: Record<MatchMode, number> = {
    SINGLES: 1,
    DOUBLES: 2
}

export interface MatchSetup {
    teamA: string[]
    teamB: string[] | null
    winningScore: MatchWinningScore
    mode: MatchMode
}

export interface Match extends Omit<MatchSetup, 'teamA' | 'teamB'> {
    id: string
    state: MatchState
    teamA: MatchTeam
    teamB: MatchTeam
    winner: WinningTeam
    winningScore: MatchWinningScore
    createdAt: string
    updatedAt: string
}

export type WinningTeam = 'teamA' | 'teamB' | null

export type MatchWinningScore = 11 | 21

export type MatchState = 'IN_PROGRESS' | 'COMPLETED' | 'SETUP'

export type Lobby = Pick<Match, 'id' | 'teamA' | 'winningScore'> & {
    teamB: Team | null
}

export interface UpdateMatchScoreDto {
    teamId: string

    score: number

    isFinalScore: boolean
}

export interface MatchChallenge {
    challenger: Pick<User, 'elo' | 'firstName' | 'id'>
    challengeeUserId: string
    matchInfo: Pick<Match, 'winningScore' | 'mode' | 'id'>
}
