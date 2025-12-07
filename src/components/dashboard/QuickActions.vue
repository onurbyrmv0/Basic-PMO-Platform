<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  DocumentChartBarIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const router = useRouter()

function goToProjects() {
  router.push('/projects')
}

function goToOrgChart() {
  router.push('/orgchart')
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button 
      class="btn-primary btn-sm flex items-center gap-2"
      @click="goToProjects"
    >
      <PlusIcon class="w-4 h-4" />
      {{ t('dashboard.newProject') }}
    </button>
    <button 
      class="btn-secondary btn-sm flex items-center gap-2"
      @click="$router.push('/gantt')"
    >
      <DocumentChartBarIcon class="w-4 h-4" />
      {{ t('dashboard.viewReports') }}
    </button>
    <button 
      class="btn-secondary btn-sm flex items-center gap-2"
      @click="goToOrgChart"
    >
      <UserGroupIcon class="w-4 h-4" />
      {{ t('dashboard.manageTeam') }}
    </button>
  </div>
</template>
