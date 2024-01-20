import type { MatchTeam, Team } from './team'

export type MatchMode = 'SINGLES' | 'DOUBLES'

export const TEAM_SIZE_BY_MATCH_MODE: Record<MatchMode, number> = {
    SINGLES: 1,
    DOUBLES: 2
}

export interface MatchSetup {
    teamA: string[]
    winningScore: MatchWinningScore
    mode: MatchMode
}

export interface Match extends Omit<MatchSetup, 'teamA'> {
    id: string
    state: MatchState
    teamA: MatchTeam
    teamB: MatchTeam
    winner: WinningTeam
    winningScore: MatchWinningScore
    createdAt: Date
}

export type WinningTeam = 'teamA' | 'teamB' | null

export type MatchWinningScore = 11 | 21

export type MatchState = 'IN_PROGRESS' | 'COMPLETE' | 'SETUP'

export type Lobby = Pick<Match, 'id' | 'teamA' | 'winningScore'> & {
    teamB: Team | null
}

export interface MatchScoreData {
    teamId: string
    score: number
}
