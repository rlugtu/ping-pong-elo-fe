<template>
    <div>
        <h1>Profile</h1>
        {{ userStore.user }}
        <button @click="authStore.handleLogout">Logout</button>
    </div>
</template>
<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const authStore = useAuthStore()
</script>
