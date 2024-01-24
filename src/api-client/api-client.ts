import { API_SERVER } from '@/utils/globals'
import axios from 'axios'

const apiClient = axios.create({
    baseURL: API_SERVER
})

export default apiClient
