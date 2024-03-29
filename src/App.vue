<template>
    <main class="relative flex flex-col h-full text-white">
        <RouterView class="font-sans" />
        <Navbar v-if="user" class="w-full h-24 absolute bottom-0">
        </Navbar>
        <Modal v-if="notification" class="z-10 flex justify-center items-center p-4">
            <Notification :notification="notification"></Notification>
        </Modal>
        <Modal v-if="matchChallenge" class="z-10 flex justify-center p-4">
            <ChallengeResponse class="mt-[60%]" :matchChallenge="matchChallenge"></ChallengeResponse>
        </Modal>
    </main>
</template>

<script lang="ts" setup>
import { useUserStore } from './stores/user'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import ChallengeResponse from './components/ChallengeResponse.vue'
import Modal from './components/Modal.vue'
import Notification from './components/Notification.vue'
import { computed, onMounted, watch } from 'vue'
import router from './router'
import { socket, socketSetup, state } from './socket'
import { useNotificationStore, type Notification as NotificationType } from './stores/notification'
import type { MatchChallenge } from './types/match'

const userStore = useUserStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const notification = computed<NotificationType | null>(() => notificationStore.notification)
const matchChallenge = computed<MatchChallenge | null>(() => state.challengeMatchRequest)

const userId = computed(() => {
    return authStore.user?.sub
})

const user = computed(() => userStore.user)

watch(userId, async (userId) => {
    try {
        if (userId && !userStore.user) {
            const user = await userStore.getUser(userId)
            if (user && socket.id) {
                socketSetup(user.id, socket.id)
            } else {
                throw Error
            }
        }
    } catch (error) {
        router.push('/user-setup')
    }
})

onMounted(() => {
    // Handles Recoonect
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            return
        }

        if (!state.connected) {
            socket.connect()
        }
    })
})
</script>
