import { useAuthStore } from '@/stores/auth'
import { API_SERVER } from '@/utils/globals'
import axios from 'axios'

const apiClient = axios.create({
    baseURL: API_SERVER,
    ...useAuthStore().getAuthHeader()
})

export default apiClient
