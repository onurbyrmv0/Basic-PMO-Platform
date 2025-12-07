<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../stores/projectStore'

const emit = defineEmits(['edit'])
const { t, locale } = useI18n()
const projectStore = useProjectStore()

const columns = computed(() => [
  { id: 'planning', title: t('projects.status.planning'), color: 'bg-blue-500' },
  { id: 'inProgress', title: t('projects.status.inProgress'), color: 'bg-yellow-500' },
  { id: 'onHold', title: t('projects.status.onHold'), color: 'bg-gray-500' },
  { id: 'completed', title: t('projects.status.completed'), color: 'bg-green-500' }
])

function getProjectsForColumn(status) {
  return projectStore.projects.filter(p => p.status === status)
}

function handleDragStart(event, project) {
  event.dataTransfer.setData('projectId', project.id)
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}

function handleDrop(event, status) {
  event.preventDefault()
  const projectId = parseInt(event.dataTransfer.getData('projectId'))
  projectStore.updateProjectStatus(projectId, status)
}
</script>

<template>
  <div class="kanban-board">
    <div 
      v-for="column in columns" 
      :key="column.id"
      class="kanban-column"
      @dragover="handleDragOver"
      @drop="handleDrop($event, column.id)"
    >
      <!-- Column Header -->
      <div class="kanban-column-header">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="column.color" />
          <span class="kanban-column-title">{{ column.title }}</span>
        </div>
        <span class="kanban-column-count">
          {{ getProjectsForColumn(column.id).length }}
        </span>
      </div>

      <!-- Cards -->
      <div class="space-y-3 min-h-32">
        <div
          v-for="project in getProjectsForColumn(column.id)"
          :key="project.id"
          class="kanban-card"
          draggable="true"
          @dragstart="handleDragStart($event, project)"
          @click="emit('edit', project)"
        >
          <!-- Priority indicator -->
          <div class="flex items-center justify-between mb-2">
            <span 
              class="badge"
              :class="{
                'badge-gray': project.priority === 'low',
                'badge-primary': project.priority === 'medium',
                'badge-warning': project.priority === 'high',
                'badge-danger': project.priority === 'critical'
              }"
            >
              {{ t(`projects.priority.${project.priority}`) }}
            </span>
            <div 
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: project.color }"
            />
          </div>

          <!-- Title -->
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">
            {{ locale === 'az' ? project.name : project.nameEn }}
          </h4>

          <!-- Description -->
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {{ locale === 'az' ? project.description : project.descriptionEn }}
          </p>

          <!-- Progress -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500">{{ t('common.progress') }}</span>
              <span class="font-medium">{{ project.progress }}%</span>
            </div>
            <div class="progress h-1.5">
              <div 
                class="progress-bar bg-primary-500"
                :style="{ width: project.progress + '%' }"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
            <div class="flex items-center gap-1">
              <div class="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span class="text-xs font-medium text-primary-600 dark:text-primary-400">
                  {{ project.manager.charAt(0) }}
                </span>
              </div>
              <span class="text-xs text-gray-500">{{ project.manager.split(' ')[0] }}</span>
            </div>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
              ₼{{ (project.budget / 1000).toFixed(0) }}K
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
