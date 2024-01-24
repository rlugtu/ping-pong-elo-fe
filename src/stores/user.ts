import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateUser, User } from '@/types/users'
import apiClient from '@/api-client/api-client'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)

    async function getUser(userId: string): Promise<User | null> {
        const res = await apiClient.get<User>(`/users/${userId}`)

        user.value = res.data
        return res.data
    }

    async function createUser(info: CreateUser): Promise<User> {
        const res = await apiClient.post<User>('/users', info)

        user.value = res.data
        return res.data
    }

    return { user, getUser, createUser }
})
