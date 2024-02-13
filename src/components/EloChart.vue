<template>
    <div class="bg-zinc-800 w-full min-h-56 rounded-md">
        <Line v-if="!loading" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script lang="ts" setup>
import { useTeamStore } from '@/stores/team'
import { onMounted, ref } from 'vue'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { DateTime } from 'luxon'
import type { Elo } from '@/types/elo'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

const props = defineProps<{
    teamId?: string
}>()

const loading = ref(true)

const chartData = ref<{ datasets: { data: number[] }[]; labels: string[] }>({
    datasets: [
        {
            data: []
        }
    ],
    labels: []
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuad'
    },
    scales: {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            grid: {
                display: false
            }
        }
    },
    plugins: {
        legend: {
            display: false
        }
    },
    layout: {
        padding: {
            top: 20,
            right: 20,
            left: 10,
            bottom: 10
        }
    }
}

onMounted(async () => {
    try {
        const eloHistory = await useTeamStore().getEloHistory(props.teamId as string)
        console.log(eloHistory)
        chartData.value = parseEloHistory(eloHistory)
        console.log(chartData.value)

        loading.value = false
    } catch (error) {
        console.log(error)
    }
})

function parseEloHistory(eloHistory: Elo[]) {
    const data: number[] = []
    const labels: string[] = []

    let index = 0
    let parsedDay = eloHistory[0].createdAt

    for (const eloRecord of eloHistory) {
        if (dayDiff(eloRecord.createdAt, parsedDay) === 0) {
            data[index] = eloRecord.elo
            labels[index] = DateTime.fromISO(eloRecord.createdAt).toFormat('M-dd')
        } else if (dayDiff(eloRecord.createdAt, parsedDay) === 1) {
            data[++index] = eloRecord.elo
            labels[index] = DateTime.fromISO(eloRecord.createdAt).toFormat('M-dd')
            parsedDay = eloRecord.createdAt
        } else {
            const gapDays = dayDiff(eloRecord.createdAt, parsedDay)

            for (let i = 0; i < gapDays; i++) {
                data[++index] = data[index - 1]
                labels[index] = DateTime.fromISO(parsedDay)
                    .plus({ days: i + 1 })
                    .toFormat('M-dd')
            }

            parsedDay = eloRecord.createdAt
        }
    }

    return {
        datasets: [
            {
                data,
                backgroundColor: '#1ABC9C',
                borderColor: '#1ABC9C',
                cubicInterpolationMode: 'default',
                tension: 0.4
            }
        ],
        labels
    }
}

function dayDiff(dateA: string, dateB: string): number {
    const dayOfDateA = DateTime.fromISO(dateA).startOf('day')
    const dayOfDateB = DateTime.fromISO(dateB).startOf('day')

    return dayOfDateA.diff(dayOfDateB).as('days')
}
</script>
