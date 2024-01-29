<template>
    <div
        class="flex flex-col items-center justify-center bg-gray-300 text-slate-300 w-full rounded-lg bg-opacity-20 p pt-4"
    >
        <h1 class="text-2xl text-left text-slate-300 w-full p-2">
            {{ notification.title }}
        </h1>
        <div class="pt-2 pb-12 border-t border-t-gray-800 w-full px-2">
            <p>{{ notification.description }}</p>
        </div>
        <div class="flex justify-center items-center w-full border-t-gray-700">
            <button class="text-red-500 w-full py-2" @click="notificationStore.clearNotifications">
                Cancel
            </button>
            <RouterLink
                class="flex justify-center items-center bg-blue-700 w-full py-2 rounded-br-lg font-bold"
                v-if="notification.cta.link"
                :to="notification.cta.link"
                @click="notificationStore.clearNotifications"
                >Go
            </RouterLink>
            <button class="bg-blue-00 w-full py-2 rounded-br-lg font-bold" v-else>
                {{ notification.cta.name }}
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useNotificationStore, type Notification } from '@/stores/notification'
const { notification } = defineProps<{
    notification: Notification
}>()

const notificationStore = useNotificationStore()
</script>
