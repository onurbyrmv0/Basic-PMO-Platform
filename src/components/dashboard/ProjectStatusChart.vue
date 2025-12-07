<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../stores/projectStore'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const chartData = computed(() => {
  const stats = projectStore.projectStats
  
  const labels = locale.value === 'az' 
    ? ['Planlaşdırma', 'Davam edir', 'Gözləmədə', 'Tamamlandı']
    : ['Planning', 'In Progress', 'On Hold', 'Completed']

  return {
    labels,
    datasets: [{
      data: [stats.planning, stats.active, stats.onHold, stats.completed],
      backgroundColor: [
        '#3b82f6', // blue
        '#f59e0b', // amber
        '#6b7280', // gray
        '#22c55e'  // green
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      }
    }
  },
  cutout: '65%'
}
</script>

<template>
  <div class="card">
    <h3 class="card-header">{{ t('dashboard.projectStatus') }}</h3>
    <div class="h-64">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
