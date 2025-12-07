<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../stores/projectStore'
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  task: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save', 'delete'])
const { t, locale } = useI18n()
const projectStore = useProjectStore()

const form = ref({
  name: '',
  nameEn: '',
  projectId: null,
  startDate: '',
  endDate: '',
  progress: 0,
  assignee: '',
  color: '#3b82f6',
  milestone: false,
  dependencies: []
})

watch(() => props.task, (newVal) => {
  if (newVal) {
    form.value = { ...newVal }
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    name: '',
    nameEn: '',
    projectId: projectStore.projects[0]?.id || null,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    progress: 0,
    assignee: '',
    color: '#3b82f6',
    milestone: false,
    dependencies: []
  }
}

const isEditing = computed(() => !!props.task)

const colorOptions = [
  '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'
]

function handleSubmit() {
  if (!form.value.name || !form.value.startDate || !form.value.endDate) {
    return
  }
  emit('save', { ...form.value })
}

function handleDelete() {
  if (props.task) {
    emit('delete', props.task.id)
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal max-w-lg">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? t('gantt.editTask') : t('gantt.newTask') }}
        </h2>
        <button 
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          <XMarkIcon class="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="modal-body space-y-4">
        <!-- Project -->
        <div>
          <label class="input-label">{{ t('projects.title') }}</label>
          <select v-model="form.projectId" class="select">
            <option 
              v-for="project in projectStore.projects" 
              :key="project.id" 
              :value="project.id"
            >
              {{ locale === 'az' ? project.name : project.nameEn }}
            </option>
          </select>
        </div>

        <!-- Name fields -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('gantt.taskName') }} (AZ)</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div>
            <label class="input-label">{{ t('gantt.taskName') }} (EN)</label>
            <input v-model="form.nameEn" type="text" class="input" />
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('gantt.startDate') }}</label>
            <input v-model="form.startDate" type="date" class="input" required />
          </div>
          <div>
            <label class="input-label">{{ t('gantt.endDate') }}</label>
            <input v-model="form.endDate" type="date" class="input" required />
          </div>
        </div>

        <!-- Assignee -->
        <div>
          <label class="input-label">{{ t('gantt.assignee') }}</label>
          <input v-model="form.assignee" type="text" class="input" />
        </div>

        <!-- Progress -->
        <div>
          <label class="input-label">{{ t('gantt.progress') }} ({{ form.progress }}%)</label>
          <input 
            v-model.number="form.progress" 
            type="range" 
            class="w-full accent-primary-600"
            min="0" 
            max="100" 
          />
        </div>

        <!-- Milestone toggle -->
        <div class="flex items-center gap-3">
          <input 
            v-model="form.milestone" 
            type="checkbox" 
            id="milestone"
            class="w-4 h-4 accent-primary-600"
          />
          <label for="milestone" class="text-sm text-gray-700 dark:text-gray-300">
            {{ t('gantt.milestone') }}
          </label>
        </div>

        <!-- Color picker -->
        <div>
          <label class="input-label">{{ t('settings.appearance.colorScheme') }}</label>
          <div class="flex items-center gap-2 mt-2">
            <button
              v-for="color in colorOptions"
              :key="color"
              type="button"
              class="w-8 h-8 rounded-full transition-transform hover:scale-110"
              :class="{ 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-800': form.color === color }"
              :style="{ backgroundColor: color }"
              @click="form.color = color"
            />
          </div>
        </div>
      </form>

      <!-- Footer -->
      <div class="modal-footer">
        <button 
          v-if="isEditing"
          type="button" 
          class="btn-danger mr-auto flex items-center gap-2"
          @click="handleDelete"
        >
          <TrashIcon class="w-4 h-4" />
          {{ t('common.delete') }}
        </button>
        <button type="button" class="btn-secondary" @click="emit('close')">
          {{ t('common.cancel') }}
        </button>
        <button type="button" class="btn-primary" @click="handleSubmit">
          {{ t('common.save') }}
        </button>
      </div>
    </div>
  </div>
</template>
