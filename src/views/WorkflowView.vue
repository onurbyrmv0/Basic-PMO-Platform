<script setup>
import { useProjectStore } from '../stores/projectStore'
const projectStore = useProjectStore()
const selectedProjectId = ref(projectStore.projects[0]?.id || null)
const selectedProject = computed(() => projectStore.projects.find(p => p.id === selectedProjectId.value))
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  LightBulbIcon,
  ClipboardDocumentListIcon,
  RocketLaunchIcon,
  EyeIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()

const currentStage = ref(0)
const completedTasks = computed({
  get() {
    return selectedProject.value?.workflowProgress || {
      initiation: [], planning: [], execution: [], monitoring: [], closing: []
    }
  },
  set(val) {
    if (selectedProject.value) {
      selectedProject.value.workflowProgress = val
      projectStore.saveToLocalStorage()
    }
  }
})
function selectProject(id) {
  selectedProjectId.value = id
}

const stages = computed(() => [
  {
    id: 'initiation',
    name: t('workflow.stages.initiation.name'),
    description: t('workflow.stages.initiation.description'),
    icon: LightBulbIcon,
    color: 'from-blue-500 to-blue-600',
    tasks: locale.value === 'az' 
      ? ['Layihə ideyasının müəyyənləşdirilməsi', 'Biznes tələblərinin təhlili', 'İlkin texniki-iqtisadi əsaslandırma', 'Maraqlı tərəflərin müəyyənləşdirilməsi', 'Layihə nizamnaməsinin hazırlanması']
      : ['Define project idea', 'Analyze business requirements', 'Initial feasibility study', 'Identify stakeholders', 'Develop project charter']
  },
  {
    id: 'planning',
    name: t('workflow.stages.planning.name'),
    description: t('workflow.stages.planning.description'),
    icon: ClipboardDocumentListIcon,
    color: 'from-purple-500 to-purple-600',
    tasks: locale.value === 'az' 
      ? ['Əhatə dairəsinin müəyyənləşdirilməsi', 'İş bölgüsü strukturunun yaradılması', 'Zaman cədvəlinin hazırlanması', 'Büdcənin planlaşdırılması', 'Risklərin müəyyənləşdirilməsi', 'Kommunikasiya planının hazırlanması']
      : ['Define scope', 'Create work breakdown structure', 'Develop schedule', 'Plan budget', 'Identify risks', 'Develop communication plan']
  },
  {
    id: 'execution',
    name: t('workflow.stages.execution.name'),
    description: t('workflow.stages.execution.description'),
    icon: RocketLaunchIcon,
    color: 'from-amber-500 to-amber-600',
    tasks: locale.value === 'az' 
      ? ['Komandanın formalaşdırılması', 'Resursların ayrılması', 'İşlərin yerinə yetirilməsi', 'Keyfiyyət təminatı', 'Maraqlı tərəflərlə əlaqə']
      : ['Assemble team', 'Allocate resources', 'Execute work', 'Quality assurance', 'Stakeholder engagement']
  },
  {
    id: 'monitoring',
    name: t('workflow.stages.monitoring.name'),
    description: t('workflow.stages.monitoring.description'),
    icon: EyeIcon,
    color: 'from-cyan-500 to-cyan-600',
    tasks: locale.value === 'az' 
      ? ['İrəliləyişin izlənilməsi', 'Dəyişikliklərin idarə edilməsi', 'Risklərin monitorinqi', 'Performansın qiymətləndirilməsi', 'Hesabatların hazırlanması']
      : ['Track progress', 'Manage changes', 'Monitor risks', 'Evaluate performance', 'Prepare reports']
  },
  {
    id: 'closing',
    name: t('workflow.stages.closing.name'),
    description: t('workflow.stages.closing.description'),
    icon: CheckBadgeIcon,
    color: 'from-green-500 to-green-600',
    tasks: locale.value === 'az' 
      ? ['Nəticələrin təhvil verilməsi', 'Sənədləşmənin tamamlanması', 'Təcrübənin sənədləşdirilməsi', 'Resursların azad edilməsi', 'Layihənin rəsmi bağlanması']
      : ['Deliver results', 'Complete documentation', 'Document lessons learned', 'Release resources', 'Formal project closure']
  }
])

const activeStage = computed(() => stages.value[currentStage.value])

function nextStage() {
  if (currentStage.value < stages.value.length - 1) {
    currentStage.value++
  }
}

function prevStage() {
  if (currentStage.value > 0) {
    currentStage.value--
  }
}

function goToStage(index) {
  currentStage.value = index
}

function toggleTask(stageId, taskIndex) {
  const newProgress = { ...completedTasks.value }
  if (!newProgress[stageId]) newProgress[stageId] = []
  const idx = newProgress[stageId].indexOf(taskIndex)
  if (idx > -1) {
    newProgress[stageId] = newProgress[stageId].filter(i => i !== taskIndex)
  } else {
    newProgress[stageId] = [...newProgress[stageId], taskIndex]
  }
  completedTasks.value = newProgress
}

function isTaskCompleted(stageId, taskIndex) {
  return completedTasks.value[stageId]?.includes(taskIndex) || false
}

function getStageProgress(stageId) {
  const stage = stages.value.find(s => s.id === stageId)
  if (!stage) return 0
  const completed = completedTasks.value[stageId]?.length || 0
  return Math.round((completed / stage.tasks.length) * 100)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Project Quick Access & Selection -->
    <div class="card mb-6">
      <h3 class="card-header flex items-center gap-2">
        <span class="font-bold">{{ locale === 'az' ? 'Layihə seçin' : 'Select Project' }}</span>
      </h3>
      <div v-if="projectStore.projects.length" class="flex flex-wrap gap-2 mt-4">
        <button v-for="project in projectStore.projects" :key="project.id"
          class="px-4 py-2 rounded-lg border transition font-medium"
          :class="selectedProjectId === project.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-primary-500'"
          @click="selectProject(project.id)">
          <span class="w-2 h-2 rounded-full inline-block mr-2" :style="{ background: project.color }"></span>
          {{ locale === 'az' ? project.name : project.nameEn }}
        </button>
      </div>
      <div v-else class="text-gray-400 text-center py-8">{{ t('projects.noProjects') }}</div>
    </div>
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('workflow.title') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        {{ locale === 'az' ? 'PMO standart layihə idarəetmə prosesi' : 'PMO standard project management process' }}
      </p>
    </div>

    <!-- Timeline Steps -->
    <div class="card">
      <div class="flex items-center justify-between px-4">
        <button 
          class="btn-ghost btn-icon"
          :disabled="currentStage === 0"
          @click="prevStage"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>

        <div class="flex-1 flex items-center justify-center gap-4 py-6 overflow-x-auto">
          <template v-for="(stage, index) in stages" :key="stage.id">
            <!-- Step Circle -->
            <div 
              class="flex flex-col items-center cursor-pointer group"
              @click="goToStage(index)"
            >
              <div 
                class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                :class="[
                  index <= currentStage 
                    ? `bg-gradient-to-br ${stage.color} text-white shadow-lg` 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500',
                  index === currentStage ? 'ring-4 ring-offset-2 dark:ring-offset-gray-900 ring-primary-200 scale-110' : 'group-hover:scale-105'
                ]"
              >
                <component :is="stage.icon" class="w-6 h-6" />
              </div>
              <span 
                class="mt-2 text-sm font-medium transition-colors whitespace-nowrap"
                :class="index === currentStage ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'"
              >
                {{ stage.name }}
              </span>
              <!-- Progress indicator -->
              <div class="w-full h-1 mt-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden" style="width: 60px;">
                <div 
                  class="h-full rounded-full transition-all duration-500"
                  :class="[
                    index < currentStage ? 'bg-green-500' : `bg-gradient-to-r ${stage.color}`
                  ]"
                  :style="{ width: getStageProgress(stage.id) + '%' }"
                />
              </div>
            </div>

            <!-- Connector Line -->
            <div 
              v-if="index < stages.length - 1"
              class="w-12 h-1 rounded-full transition-colors duration-300"
              :class="index < currentStage ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'"
            />
          </template>
        </div>

        <button 
          class="btn-ghost btn-icon"
          :disabled="currentStage === stages.length - 1"
          @click="nextStage"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Active Stage Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Stage Info -->
      <div class="card">
        <div class="flex items-start gap-4">
          <div 
            class="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br"
            :class="activeStage.color"
          >
            <component :is="activeStage.icon" class="w-8 h-8 text-white" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ activeStage.name }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mt-1">
              {{ activeStage.description }}
            </p>
            
            <!-- Progress -->
            <div class="mt-4">
              <div class="flex justify-between text-sm mb-2">
                <span class="text-gray-500">{{ t('common.progress') }}</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ getStageProgress(activeStage.id) }}%
                </span>
              </div>
              <div class="progress h-2">
                <div 
                  class="progress-bar bg-gradient-to-r transition-all duration-500"
                  :class="activeStage.color"
                  :style="{ width: getStageProgress(activeStage.id) + '%' }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Stage navigation -->
        <div class="mt-6 flex justify-between">
          <button 
            class="btn-secondary"
            :disabled="currentStage === 0"
            @click="prevStage"
          >
            {{ t('common.previous') }}
          </button>
          <button 
            class="btn-primary"
            :disabled="currentStage === stages.length - 1"
            @click="nextStage"
          >
            {{ t('common.next') }}
          </button>
        </div>
      </div>

      <!-- Checklist -->
      <div class="card">
        <h3 class="card-header flex items-center gap-2">
          <ClipboardDocumentListIcon class="w-5 h-5" />
          {{ locale === 'az' ? 'Tapşırıq Siyahısı' : 'Task Checklist' }}
        </h3>

        <div class="space-y-3">
          <div 
            v-for="(task, index) in activeStage.tasks" 
            :key="index"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            @click="toggleTask(activeStage.id, index)"
          >
            <div 
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
              :class="isTaskCompleted(activeStage.id, index) 
                ? 'border-green-500 bg-green-500 text-white' 
                : 'border-gray-300 dark:border-gray-600'"
            >
              <svg 
                v-if="isTaskCompleted(activeStage.id, index)" 
                class="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span 
              class="flex-1 transition-colors"
              :class="isTaskCompleted(activeStage.id, index) 
                ? 'text-gray-400 line-through' 
                : 'text-gray-700 dark:text-gray-300'"
            >
              {{ task }}
            </span>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
          <span class="text-gray-500">
            {{ t('workflow.completedTasks') }}: {{ completedTasks[activeStage.id]?.length || 0 }}/{{ activeStage.tasks.length }}
          </span>
          <span class="text-gray-500">
            {{ t('workflow.pendingTasks') }}: {{ activeStage.tasks.length - (completedTasks[activeStage.id]?.length || 0) }}
          </span>
        </div>
      </div>
    </div>

    <!-- All Stages Overview -->
    <div class="card">
      <h3 class="card-header">{{ locale === 'az' ? 'Bütün Mərhələlər' : 'All Stages Overview' }}</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div 
          v-for="(stage, index) in stages" 
          :key="stage.id"
          class="p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg"
          :class="[
            index === currentStage 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
          ]"
          @click="goToStage(index)"
        >
          <div class="flex items-center gap-2 mb-2">
            <div 
              class="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white"
              :class="stage.color"
            >
              <component :is="stage.icon" class="w-4 h-4" />
            </div>
            <span class="font-medium text-gray-900 dark:text-white text-sm">
              {{ stage.name }}
            </span>
          </div>
          
          <div class="mt-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500">{{ getStageProgress(stage.id) }}%</span>
            </div>
            <div class="progress h-1.5">
              <div 
                class="progress-bar"
                :class="index < currentStage ? 'bg-green-500' : 'bg-primary-500'"
                :style="{ width: getStageProgress(stage.id) + '%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
