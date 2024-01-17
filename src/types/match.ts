export interface Match {
    id: string
    state: MatchState
    sideA: string[]
    sideAScore: number
    sideB: string[]
    sideBScore: number
    winner: WinningTeam
    winningScore: MatchWinningScore
    createdAt: Date
}

export type WinningTeam = 'teamA' | 'teamB' | null

export type MatchState = 'IN_PROGRESS' | 'COMPLETE' | 'SETUP'

export type MatchSetup = Pick<
    Match,
    'sideA' | 'sideB' | 'winningScore' | 'sideAScore' | 'sideBScore'
>

export type MatchWinningScore = 11 | 21

export interface LobbyPlayerInfo {
    id: string
    firstName: string
    lastName: string
    elo: number
    department: string | null
}

export interface Lobby {
    id: string
    sideA: LobbyPlayerInfo[]
    sideB: LobbyPlayerInfo[]
    winningScore: MatchWinningScore
}
