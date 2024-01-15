<template>
    <main>
        <TheWelcome />
        {{ authStore.user }}
        <button @click="authStore.handleLogin">Login</button>

        <button @click="authStore.handleLogout">Logout</button>
    </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
