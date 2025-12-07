<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '../stores/taskStore'
import { useProjectStore } from '../stores/projectStore'
import GanttChart from '../components/gantt/GanttChart.vue'
import TaskModal from '../components/gantt/TaskModal.vue'
import {
  PlusIcon,
  CalendarDaysIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const taskStore = useTaskStore()
const projectStore = useProjectStore()

const showModal = ref(false)
const editingTask = ref(null)

onMounted(() => {
  taskStore.loadFromLocalStorage()
  projectStore.loadFromLocalStorage()
})

const viewScales = computed(() => [
  { id: 'day', label: t('gantt.views.day') },
  { id: 'week', label: t('gantt.views.week') },
  { id: 'month', label: t('gantt.views.month') }
])

function openCreateModal() {
  editingTask.value = null
  showModal.value = true
}

function openEditModal(task) {
  editingTask.value = task
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTask.value = null
}

function handleSave(task) {
  if (editingTask.value) {
    taskStore.updateTask(editingTask.value.id, task)
  } else {
    taskStore.addTask(task)
  }
  closeModal()
}

function handleDelete(id) {
  if (confirm(t('gantt.deleteTask') + '?')) {
    taskStore.deleteTask(id)
  }
}

function goToToday() {
  // Scroll to today in the chart
  const today = document.querySelector('.gantt-today-marker')
  if (today) {
    today.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }
}

function exportGantt() {
  // Export functionality
  console.log('Exporting Gantt chart...')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('gantt.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ taskStore.filteredTasks.length }} {{ locale === 'az' ? 'tapşırıq' : 'tasks' }}
        </p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openCreateModal">
        <PlusIcon class="w-5 h-5" />
        {{ t('gantt.newTask') }}
      </button>
    </div>

    <!-- Controls -->
    <div class="card">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Project Filter -->
        <div class="flex items-center gap-4">
          <select 
            :value="taskStore.selectedProjectId || ''" 
            @change="taskStore.setProjectFilter($event.target.value ? parseInt($event.target.value) : null)"
            class="select max-w-xs"
          >
            <option value="">{{ t('common.all') }} {{ t('projects.title') }}</option>
            <option 
              v-for="project in projectStore.projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ locale === 'az' ? project.name : project.nameEn }}
            </option>
          </select>
        </div>

        <!-- View Controls -->
        <div class="flex items-center gap-2">
          <!-- View Scale -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              v-for="scale in viewScales"
              :key="scale.id"
              class="px-3 py-1.5 text-sm rounded-md transition-colors"
              :class="taskStore.viewScale === scale.id 
                ? 'bg-white dark:bg-gray-600 shadow-sm font-medium text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              @click="taskStore.setViewScale(scale.id)"
            >
              {{ scale.label }}
            </button>
          </div>

          <!-- Separator -->
          <div class="w-px h-8 bg-gray-200 dark:bg-gray-700" />

          <!-- Action buttons -->
          <button 
            class="btn-ghost btn-icon"
            :title="t('gantt.today')"
            @click="goToToday"
          >
            <CalendarDaysIcon class="w-5 h-5" />
          </button>

          <button 
            class="btn-ghost btn-icon"
            :class="{ 'text-primary-600': taskStore.showDependencies }"
            :title="t('gantt.showDependencies')"
            @click="taskStore.toggleDependencies"
          >
            <ArrowPathIcon class="w-5 h-5" />
          </button>

          <button 
            class="btn-ghost btn-icon"
            :class="{ 'text-primary-600': taskStore.showCriticalPath }"
            :title="t('gantt.criticalPath')"
            @click="taskStore.toggleCriticalPath"
          >
            <ArrowsPointingOutIcon class="w-5 h-5" />
          </button>

          <button 
            class="btn-ghost btn-icon"
            :title="t('export.pdf')"
            @click="exportGantt"
          >
            <DocumentArrowDownIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Gantt Chart -->
    <GanttChart
      :tasks="taskStore.filteredTasks"
      :view-scale="taskStore.viewScale"
      :show-dependencies="taskStore.showDependencies"
      @task-click="openEditModal"
      @task-update="(id, updates) => taskStore.updateTask(id, updates)"
    />

    <!-- Task Modal -->
    <TaskModal
      v-if="showModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>
