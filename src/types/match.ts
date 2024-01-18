import type { Team } from './team'

export interface Match {
    id: string
    state: MatchState
    teamA: Team
    teamAScore: number
    teamB: Team
    teamBScore: number
    winner: WinningTeam
    winningScore: MatchWinningScore
    createdAt: Date
}

export type WinningTeam = 'teamA' | 'teamB' | null

export type MatchWinningScore = 11 | 21

export type MatchState = 'IN_PROGRESS' | 'COMPLETE' | 'SETUP'

export type MatchSetup = Pick<Match, 'winningScore'> & {
    teamA: string[]
}

export type Lobby = Pick<Match, 'id' | 'teamA' | 'winningScore'> & {
    teamB: Team | null
}
