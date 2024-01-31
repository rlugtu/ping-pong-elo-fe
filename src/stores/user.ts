import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CreateUser, User } from '@/types/users'
import apiClient from '@/api-client/api-client'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null)

    async function getUser(userId: string): Promise<User | null> {
        const res = await apiClient.get<User>(`/users/${userId}`)

        user.value = res.data
        return res.data
    }

    async function refreshUser(): Promise<void> {
        if (!user.value?.id) {
            return
        }
        await getUser(user.value.id)
    }

    async function createUser(info: CreateUser): Promise<User> {
        const res = await apiClient.post<User>('/users', info, await useAuthStore().getAuthHeader())

        user.value = res.data
        return res.data
    }

    async function getAllUsers(): Promise<User[]> {
        const res = await apiClient.get<User[]>('/users')
        return res.data
    }

    return { user, getUser, createUser, refreshUser, getAllUsers }
})
