import type { Match } from '@/types/match'
import type { Team } from '@/types/team'
import type { User } from '@/types/users'

export const testUser: User = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    department: null
}

export const testTeam: Team = {
    id: 'team-id',
    users: [testUser],
    elo: 1400
}
export const testMatch: Match = {
    id: 'match-id',
    state: 'IN_PROGRESS',
    teamA: testTeam,
    teamAScore: 0,
    teamB: testTeam,
    teamBScore: 0,
    winner: null,
    winningScore: 11,
    createdAt: new Date()
}
