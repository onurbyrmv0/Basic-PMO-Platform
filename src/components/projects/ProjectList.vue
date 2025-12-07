<script setup>
import { useI18n } from 'vue-i18n'
import {
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  projects: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete', 'view'])

const { t, locale } = useI18n()

function getStatusClass(status) {
  const classes = {
    planning: 'badge-primary',
    inProgress: 'badge-warning',
    onHold: 'badge-gray',
    completed: 'badge-success',
    cancelled: 'badge-danger'
  }
  return classes[status] || 'badge-gray'
}

function getPriorityClass(priority) {
  const classes = {
    low: 'text-gray-500',
    medium: 'text-blue-500',
    high: 'text-orange-500',
    critical: 'text-red-500'
  }
  return classes[priority] || 'text-gray-500'
}

function formatDate(date) {
  return new Date(date).toLocaleDateString(locale.value === 'az' ? 'az-AZ' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="card p-0 overflow-hidden">
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t('projects.projectName') }}</th>
            <th>{{ t('common.status') }}</th>
            <th>{{ t('common.priority') }}</th>
            <th>{{ t('common.progress') }}</th>
            <th>{{ t('projects.manager') }}</th>
            <th>{{ t('projects.endDate') }}</th>
            <th>{{ t('projects.budget') }}</th>
            <th class="text-right">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <!-- Project Name -->
            <td>
              <div class="flex items-center gap-3">
                <div 
                  class="w-3 h-3 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: project.color }"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ locale === 'az' ? project.name : project.nameEn }}
                  </p>
                  <p class="text-xs text-gray-500 line-clamp-1 max-w-xs">
                    {{ locale === 'az' ? project.description : project.descriptionEn }}
                  </p>
                </div>
              </div>
            </td>
            
            <!-- Status -->
            <td>
              <span class="badge" :class="getStatusClass(project.status)">
                {{ t(`projects.status.${project.status}`) }}
              </span>
            </td>
            
            <!-- Priority -->
            <td>
              <span class="font-medium" :class="getPriorityClass(project.priority)">
                {{ t(`projects.priority.${project.priority}`) }}
              </span>
            </td>
            
            <!-- Progress -->
            <td>
              <div class="flex items-center gap-2 min-w-24">
                <div class="flex-1 progress">
                  <div 
                    class="progress-bar"
                    :class="{
                      'bg-green-500': project.progress >= 75,
                      'bg-yellow-500': project.progress >= 50 && project.progress < 75,
                      'bg-blue-500': project.progress < 50
                    }"
                    :style="{ width: project.progress + '%' }"
                  />
                </div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ project.progress }}%
                </span>
              </div>
            </td>
            
            <!-- Manager -->
            <td>
              <span class="text-gray-700 dark:text-gray-300">{{ project.manager }}</span>
            </td>
            
            <!-- End Date -->
            <td>
              <span class="text-gray-700 dark:text-gray-300">{{ formatDate(project.endDate) }}</span>
            </td>
            
            <!-- Budget -->
            <td>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">
                  ₼{{ project.budget.toLocaleString() }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ t('dashboard.spentBudget') }}: ₼{{ project.spent.toLocaleString() }}
                </p>
              </div>
            </td>
            
            <!-- Actions -->
            <td>
              <div class="flex items-center justify-end gap-1">
                <button 
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="emit('edit', project)"
                >
                  <PencilIcon class="w-4 h-4 text-gray-500 hover:text-primary-600" />
                </button>
                <button 
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  @click="emit('delete', project.id)"
                >
                  <TrashIcon class="w-4 h-4 text-gray-500 hover:text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
