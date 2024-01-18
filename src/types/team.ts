import type { User } from './users'

export interface Team {
    id: string
    users: {
        user: User
    }[]
    elo: number
}

export type TeamMatchSide = 'teamA' | 'teamB'
