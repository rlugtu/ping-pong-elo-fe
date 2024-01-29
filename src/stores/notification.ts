import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
    title: string
    description: string
    cta: {
        name: string
        link: string | null
    }
}

export const useNotificationStore = defineStore('notification', () => {
    const notification = ref<Notification | null>(null)

    function clearNotifications(): void {
        notification.value = null
    }

    return { notification, clearNotifications }
})
