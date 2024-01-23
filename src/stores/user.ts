import { defineStore } from 'pinia'
import { useAuth0 } from '@auth0/auth0-vue'
import axios from 'axios'
import { API_SERVER } from '@/utils/globals'
import { ref } from 'vue'
import type { CreateUser, User } from '@/types/users'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
    const { getAccessTokenSilently } = useAuth0()
    const user = ref<User | null>(null)

    async function getUser(userId: string): Promise<User | null> {
        const res = await axios.get<User>(`${API_SERVER}/users/${userId}`, {
            headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        })

        user.value = res.data
        return res.data
    }

    async function createUser(info: CreateUser): Promise<User> {
        const authHeader = await useAuthStore().getAuthHeader()
        const res = await axios.post<User>(`${API_SERVER}/users`, info, authHeader)

        user.value = res.data
        return res.data
    }

    return { user, getUser, createUser }
})
