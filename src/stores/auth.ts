import { defineStore } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'

export const useAuthStore = defineStore('auth', () => {
    const { user, loginWithRedirect, logout } = useAuth0()

    const handleLogin = () => {
        loginWithRedirect({
            appState: {
                target: '/profile'
            }
        })
    }

    const handleLogout = () =>
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })

    return { user, handleLogin, handleLogout }
})
