import type { Elo } from './elo'
import type { Team } from './team'

export interface CreateUser {
    id: string
    firstName: string
    lastName: string | null
    department: string | null
    email: string
}
export interface User extends CreateUser {
    eloHistory: Elo[]
    teams: Team[]
}
