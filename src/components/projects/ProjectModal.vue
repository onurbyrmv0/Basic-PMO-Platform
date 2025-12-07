<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  project: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])
const { t, locale } = useI18n()

const form = ref({
  name: '',
  nameEn: '',
  description: '',
  descriptionEn: '',
  status: 'planning',
  priority: 'medium',
  startDate: '',
  endDate: '',
  budget: 0,
  manager: '',
  color: '#3b82f6'
})

// Initialize form when editing
watch(() => props.project, (newVal) => {
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
    description: '',
    descriptionEn: '',
    status: 'planning',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
    manager: '',
    color: '#3b82f6'
  }
}

const isEditing = computed(() => !!props.project)

const statusOptions = computed(() => [
  { value: 'planning', label: t('projects.status.planning') },
  { value: 'inProgress', label: t('projects.status.inProgress') },
  { value: 'onHold', label: t('projects.status.onHold') },
  { value: 'completed', label: t('projects.status.completed') },
  { value: 'cancelled', label: t('projects.status.cancelled') }
])

const priorityOptions = computed(() => [
  { value: 'low', label: t('projects.priority.low') },
  { value: 'medium', label: t('projects.priority.medium') },
  { value: 'high', label: t('projects.priority.high') },
  { value: 'critical', label: t('projects.priority.critical') }
])

const colorOptions = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b'  // slate
]

function handleSubmit() {
  // Validate
  if (!form.value.name || !form.value.startDate || !form.value.endDate) {
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal max-w-2xl">
      <!-- Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEditing ? t('projects.editProject') : t('projects.newProject') }}
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
        <!-- Name fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('projects.projectName') }} (AZ)</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div>
            <label class="input-label">{{ t('projects.projectName') }} (EN)</label>
            <input v-model="form.nameEn" type="text" class="input" />
          </div>
        </div>

        <!-- Description fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('projects.projectDescription') }} (AZ)</label>
            <textarea v-model="form.description" class="input" rows="3"></textarea>
          </div>
          <div>
            <label class="input-label">{{ t('projects.projectDescription') }} (EN)</label>
            <textarea v-model="form.descriptionEn" class="input" rows="3"></textarea>
          </div>
        </div>

        <!-- Status & Priority -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('common.status') }}</label>
            <select v-model="form.status" class="select">
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="input-label">{{ t('common.priority') }}</label>
            <select v-model="form.priority" class="select">
              <option v-for="opt in priorityOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('projects.startDate') }}</label>
            <input v-model="form.startDate" type="date" class="input" required />
          </div>
          <div>
            <label class="input-label">{{ t('projects.endDate') }}</label>
            <input v-model="form.endDate" type="date" class="input" required />
          </div>
        </div>

        <!-- Budget & Manager -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('projects.budget') }} (₼)</label>
            <input v-model.number="form.budget" type="number" class="input" min="0" />
          </div>
          <div>
            <label class="input-label">{{ t('projects.manager') }}</label>
            <input v-model="form.manager" type="text" class="input" />
          </div>
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

        <!-- Progress (only for editing) -->
        <div v-if="isEditing">
          <label class="input-label">{{ t('common.progress') }} ({{ form.progress }}%)</label>
          <input 
            v-model.number="form.progress" 
            type="range" 
            class="w-full accent-primary-600"
            min="0" 
            max="100" 
          />
        </div>
      </form>

      <!-- Footer -->
      <div class="modal-footer">
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
