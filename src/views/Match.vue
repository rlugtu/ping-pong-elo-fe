<template>
    <main>
        <LoadingScreen
            v-if="loading || match === null"
            class="flex justify-center mt-[40%]"
        ></LoadingScreen>
        <div v-else>
            <h1>Live Match</h1>

            <div class="flex flex-col items-center justify-center">
                <div>Opposing Team</div>
                <div>User Team</div>
            </div>
        </div>
    </main>
</template>

<script lang="ts" setup>
import type { Match } from '@/types/match'
import LoadingScreen from '@/components/LoadingScreen.vue'
import { onMounted, ref } from 'vue'
import { useMatchStore } from '@/stores/match'
import { useRoute } from 'vue-router'
import router from '@/router'

const matchStore = useMatchStore()

const loading = ref(false)
const match = ref<Match | null>(null)

onMounted(async () => {
    try {
        loading.value = true
        const route = useRoute()
        const matchId = route.params['id']

        // gross, fix match id type
        if (!matchId || typeof matchId !== 'string') {
            router.push('/')
            return
        }

        match.value = await matchStore.getMatch(matchId)
    } catch (error) {
        console.log({ error })
    } finally {
        loading.value = false
    }
})
</script>
