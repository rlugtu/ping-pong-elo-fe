import type { Match } from '@/types/match'
import type { MatchTeam, Team } from '@/types/team'
import type { User } from '@/types/users'

export const testUser: User = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    department: null,
    eloHistory: []
}

export const testTeam: Team = {
    id: 'team-id',
    users: [testUser],
    elo: 1400
}

export const testMatchTeam: MatchTeam = {
    ...testTeam,
    score: 0,
    createdAt: new Date(),
    updatedAt: new Date()
}

export const testMatch: Match = {
    id: 'match-id',
    state: 'IN_PROGRESS',
    teamA: testMatchTeam,
    teamB: testMatchTeam,
    mode: 'SINGLES',
    winner: null,
    winningScore: 11,
    createdAt: new Date()
}
