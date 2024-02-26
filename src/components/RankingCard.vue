<template>
    <div class="flex justify-between items-center rounded-lg bg-[#3557FC] px-2 py-3 w-full" ref="scrollTarget">
        <div class="flex items-center gap-2">
            <span class="w-8 text-center text-xl font-bold font-unbounded">{{ place }}</span>
            <div v-for="(user, i) in team.users" :key="i">
                <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            </div>
        </div>
        <span class="px-0.5 py-0.5 w-10 bg-[#FFE5D4] rounded-full text-[10px] text-center text-orange-600">
            {{ team.elo }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Team } from '@/types/team'
import { useMotion } from '@vueuse/motion'

interface RankConfig {
  team: Team,
  place: Number
}

const scrollTarget = ref()

useMotion(scrollTarget, {
    initial: {
        opacity: 0,
        y: 100,
        scale: 0.6
    },
    visibleOnce: {
        opacity: 1,
        y: 0,
        scale: 1
    }
})

const { team, place } = defineProps<RankConfig>()
</script>
