import type { Match } from '@/types/match'
import type { User } from '@/types/users'

export const testUser: User = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    elo: 1400,
    email: 'email',
    department: null
}
export const testMatch: Match = {
    state: 'IN_PROGRESS',
    sideA: [testUser],
    sideAScore: 0,
    sideB: [testUser],
    sideBScore: 0,
    winner: null,
    winningScore: 11,
    createdAt: new Date()
}
