<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../stores/projectStore'
import ProjectList from '../components/projects/ProjectList.vue'
import KanbanBoard from '../components/projects/KanbanBoard.vue'
import ProjectModal from '../components/projects/ProjectModal.vue'
import {
  PlusIcon,
  ListBulletIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const showModal = ref(false)
const editingProject = ref(null)

onMounted(() => {
  projectStore.loadFromLocalStorage()
})

const viewModes = [
  { id: 'list', icon: ListBulletIcon },
  { id: 'kanban', icon: ViewColumnsIcon },
  { id: 'grid', icon: Squares2X2Icon }
]

const statusFilters = computed(() => [
  { id: 'all', label: t('projects.filters.all') },
  { id: 'inProgress', label: t('projects.status.inProgress') },
  { id: 'planning', label: t('projects.status.planning') },
  { id: 'onHold', label: t('projects.status.onHold') },
  { id: 'completed', label: t('projects.status.completed') }
])

function openCreateModal() {
  editingProject.value = null
  showModal.value = true
}

function openEditModal(project) {
  editingProject.value = project
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingProject.value = null
}

function handleSave(project) {
  if (editingProject.value) {
    projectStore.updateProject(editingProject.value.id, project)
  } else {
    projectStore.addProject(project)
  }
  closeModal()
}

function handleDelete(id) {
  if (confirm(t('projects.deleteConfirm'))) {
    projectStore.deleteProject(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('projects.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ projectStore.filteredProjects.length }} {{ t('projects.title').toLowerCase() }}
        </p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openCreateModal">
        <PlusIcon class="w-5 h-5" />
        {{ t('projects.newProject') }}
      </button>
    </div>

    <!-- Filters and View Controls -->
    <div class="card">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <!-- Search -->
        <div class="flex items-center gap-2 flex-1">
          <div class="relative flex-1 max-w-md">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              :value="projectStore.searchQuery"
              @input="projectStore.setSearch($event.target.value)"
              type="text"
              :placeholder="t('common.search') + '...'"
              class="input pl-10"
            />
          </div>
        </div>

        <!-- Filter & View Controls -->
        <div class="flex items-center gap-4">
          <!-- Status Filter -->
          <div class="flex items-center gap-2">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <select
              :value="projectStore.filterStatus"
              @change="projectStore.setFilter($event.target.value)"
              class="select"
            >
              <option v-for="filter in statusFilters" :key="filter.id" :value="filter.id">
                {{ filter.label }}
              </option>
            </select>
          </div>

          <!-- View Mode Toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              v-for="mode in viewModes"
              :key="mode.id"
              class="p-2 rounded-md transition-colors"
              :class="projectStore.viewMode === mode.id 
                ? 'bg-white dark:bg-gray-600 shadow-sm' 
                : 'hover:bg-gray-200 dark:hover:bg-gray-600'"
              @click="projectStore.setViewMode(mode.id)"
            >
              <component 
                :is="mode.icon" 
                class="w-5 h-5"
                :class="projectStore.viewMode === mode.id 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500'"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Views -->
    <div v-if="projectStore.filteredProjects.length > 0">
      <!-- List View -->
      <ProjectList 
        v-if="projectStore.viewMode === 'list'" 
        :projects="projectStore.filteredProjects"
        @edit="openEditModal"
        @delete="handleDelete"
      />
      
      <!-- Kanban View -->
      <KanbanBoard 
        v-else-if="projectStore.viewMode === 'kanban'"
        @edit="openEditModal"
      />
      
      <!-- Grid View -->
      <div 
        v-else 
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <div
          v-for="project in projectStore.filteredProjects"
          :key="project.id"
          class="card cursor-pointer hover:shadow-lg transition-shadow"
          @click="openEditModal(project)"
        >
          <div class="flex items-start justify-between mb-4">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: project.color }"
            />
            <span 
              class="badge"
              :class="{
                'badge-primary': project.status === 'planning',
                'badge-warning': project.status === 'inProgress' || project.status === 'onHold',
                'badge-success': project.status === 'completed',
                'badge-danger': project.status === 'cancelled'
              }"
            >
              {{ t(`projects.status.${project.status}`) }}
            </span>
          </div>
          
          <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
            {{ locale === 'az' ? project.name : project.nameEn }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
            {{ locale === 'az' ? project.description : project.descriptionEn }}
          </p>
          
          <!-- Progress -->
          <div class="mb-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-500">{{ t('common.progress') }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ project.progress }}%</span>
            </div>
            <div class="progress">
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
          </div>
          
          <!-- Footer -->
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ project.manager }}</span>
            <span>₼{{ project.budget.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-else 
      class="card text-center py-12"
    >
      <FunnelIcon class="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ t('projects.noProjects') }}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">
        {{ t('projects.noProjects') }}
      </p>
      <button class="btn-primary" @click="openCreateModal">
        <PlusIcon class="w-5 h-5 mr-2" />
        {{ t('projects.newProject') }}
      </button>
    </div>

    <!-- Project Modal -->
    <ProjectModal
      v-if="showModal"
      :project="editingProject"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
