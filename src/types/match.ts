export interface Match {
    id: string
    state: 'IN_PROGRESS' | 'COMPLETE' | 'SETUP'
    sideA: string[]
    sideAScore: number
    sideB: string[]
    sideBScore: number
    winner: 'sideA' | 'sideB' | null
    winningScore: MatchWinningScore
    createdAt: Date
}

export type MatchSetup = Pick<
    Match,
    'sideA' | 'sideB' | 'winningScore' | 'sideAScore' | 'sideBScore'
>

export type MatchWinningScore = 11 | 21

export interface LobbyPlayerInfo {
    firstName: string
    lastName: string
    id: string
    elo: number
    department: string | null
}
export interface Lobby {
    id: string
    sideA: LobbyPlayerInfo[]
    sideB: LobbyPlayerInfo[]
    winningScore: MatchWinningScore
}
