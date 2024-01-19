import { defineStore } from 'pinia'
import { User as Auth0User, useAuth0 } from '@auth0/auth0-vue'
import type { User } from '@/types/users'

export interface AuthHeader {
    headers: {
        Authorization: string
    }
}

export const useAuthStore = defineStore('auth', () => {
    const { user, loginWithRedirect, logout, getAccessTokenSilently, isAuthenticated } = useAuth0()

    async function handleLogin(): Promise<void> {
        loginWithRedirect({
            appState: {
                target: '/'
            }
        })
    }

    function createUserFromGoogleUser(user: Auth0User): User {
        return {
            id: user.sub || '',
            firstName: user?.given_name || 'first',
            lastName: user?.family_ame || 'last name',
            department: null,
            email: user?.email || 'email'
        }
    }

    async function getAuthHeader(): Promise<AuthHeader> {
        return {
            headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        }
    }

    const handleLogout = () =>
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })

    return {
        user,
        handleLogin,
        handleLogout,
        getAccessTokenSilently,
        createUserFromGoogleUser,
        isAuthenticated,
        getAuthHeader
    }
})
