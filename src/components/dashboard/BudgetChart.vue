<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../stores/projectStore'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const chartData = computed(() => {
  const projects = projectStore.projects.slice(0, 5)
  
  return {
    labels: projects.map(p => locale.value === 'az' ? p.name : p.nameEn),
    datasets: [
      {
        label: locale.value === 'az' ? 'Büdcə' : 'Budget',
        data: projects.map(p => p.budget),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: locale.value === 'az' ? 'Xərclənmiş' : 'Spent',
        data: projects.map(p => p.spent),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      callbacks: {
        label: function(context) {
          const value = context.raw
          return `${context.dataset.label}: ₼${value.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: function(value) {
          return '₼' + value.toLocaleString()
        }
      }
    }
  }
}
</script>

<template>
  <div class="card">
    <h3 class="card-header">{{ t('dashboard.budgetOverview') }}</h3>
    <div class="h-64">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
