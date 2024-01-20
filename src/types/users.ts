import type { Elo } from './elo'

export interface CreateUser {
    id: string
    firstName: string
    lastName: string | null
    department: string | null
    email: string
}
export interface User extends CreateUser {
    eloHistory: Elo[]
}
