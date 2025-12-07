<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../stores/projectStore'
import { useEmployeeStore } from '../stores/employeeStore'
import KpiCard from '../components/dashboard/KpiCard.vue'
import ProjectStatusChart from '../components/dashboard/ProjectStatusChart.vue'
import BudgetChart from '../components/dashboard/BudgetChart.vue'
import RecentActivities from '../components/dashboard/RecentActivities.vue'
import QuickActions from '../components/dashboard/QuickActions.vue'
import {
  FolderIcon,
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const projectStore = useProjectStore()
const employeeStore = useEmployeeStore()

onMounted(() => {
  projectStore.loadFromLocalStorage()
  employeeStore.loadFromLocalStorage()
})

const stats = computed(() => projectStore.projectStats)

const kpiCards = computed(() => [
  {
    title: t('dashboard.totalProjects'),
    value: stats.value.total,
    icon: FolderIcon,
    color: 'primary',
    change: '+2',
    changeType: 'up'
  },
  {
    title: t('dashboard.activeProjects'),
    value: stats.value.active,
    icon: PlayIcon,
    color: 'blue',
    change: '+1',
    changeType: 'up'
  },
  {
    title: t('dashboard.completedProjects'),
    value: stats.value.completed,
    icon: CheckCircleIcon,
    color: 'green',
    change: '+1',
    changeType: 'up'
  },
  {
    title: t('dashboard.delayedProjects'),
    value: stats.value.delayed,
    icon: ExclamationTriangleIcon,
    color: 'red',
    change: '0',
    changeType: 'neutral'
  },
  {
    title: t('dashboard.totalBudget'),
    value: formatCurrency(stats.value.totalBudget),
    icon: CurrencyDollarIcon,
    color: 'purple',
    subtitle: `${t('dashboard.spentBudget')}: ${formatCurrency(stats.value.totalSpent)}`
  },
  {
    title: t('dashboard.teamMembers'),
    value: employeeStore.totalEmployees,
    icon: UserGroupIcon,
    color: 'orange',
    change: '+3',
    changeType: 'up'
  }
])

function formatCurrency(value) {
  return new Intl.NumberFormat(locale.value === 'az' ? 'az-AZ' : 'en-US', {
    style: 'currency',
    currency: 'AZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('dashboard.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ t('dashboard.welcome') }} {{ t('dashboard.overview') }}
        </p>
      </div>
      <QuickActions />
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <KpiCard
        v-for="(card, index) in kpiCards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :color="card.color"
        :change="card.change"
        :changeType="card.changeType"
        :subtitle="card.subtitle"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProjectStatusChart />
      <BudgetChart />
    </div>

    <!-- Recent Activities -->
    <RecentActivities />
  </div>
</template>
