<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEmployeeStore } from '../../stores/employeeStore'
import { XMarkIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  employee: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save', 'delete'])
const { t, locale } = useI18n()
const employeeStore = useEmployeeStore()

const form = ref({
  name: '',
  position: 'developer',
  department: 'Development',
  email: '',
  phone: '',
  managerId: null,
  responsibilities: [],
  responsibilitiesEn: [],
  color: '#3b82f6'
})

const newResponsibility = ref('')
const newResponsibilityEn = ref('')

watch(() => props.employee, (newVal) => {
  if (newVal) {
    form.value = { 
      ...newVal,
      responsibilities: [...(newVal.responsibilities || [])],
      responsibilitiesEn: [...(newVal.responsibilitiesEn || [])]
    }
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.value = {
    name: '',
    position: 'developer',
    department: 'Development',
    email: '',
    phone: '',
    managerId: null,
    responsibilities: [],
    responsibilitiesEn: [],
    color: '#3b82f6'
  }
}

const isEditing = computed(() => !!props.employee)

const positionOptions = computed(() => [
  { value: 'pmoDirector', label: t('orgchart.pmoDirector') },
  { value: 'projectManager', label: t('orgchart.projectManager') },
  { value: 'teamLead', label: t('orgchart.teamLead') },
  { value: 'developer', label: t('orgchart.developer') },
  { value: 'analyst', label: t('orgchart.analyst') },
  { value: 'designer', label: t('orgchart.designer') },
  { value: 'tester', label: t('orgchart.tester') }
])

const departmentOptions = ['PMO', 'Development', 'Design', 'QA', 'Analysis']

const colorOptions = [
  '#1e40af', '#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#64748b', '#14b8a6'
]

// Get potential managers (exclude self and subordinates)
const potentialManagers = computed(() => {
  return employeeStore.employees.filter(e => {
    if (props.employee && e.id === props.employee.id) return false
    return true
  })
})

function addResponsibility() {
  if (newResponsibility.value.trim()) {
    form.value.responsibilities.push(newResponsibility.value.trim())
    newResponsibility.value = ''
  }
}

function addResponsibilityEn() {
  if (newResponsibilityEn.value.trim()) {
    form.value.responsibilitiesEn.push(newResponsibilityEn.value.trim())
    newResponsibilityEn.value = ''
  }
}

function removeResponsibility(index) {
  form.value.responsibilities.splice(index, 1)
}

function removeResponsibilityEn(index) {
  form.value.responsibilitiesEn.splice(index, 1)
}

function handleSubmit() {
  if (!form.value.name || !form.value.position) {
    return
  }
  emit('save', { ...form.value })
}

function handleDelete() {
  if (props.employee) {
    emit('delete', props.employee.id)
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="modal-header sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h2 class="modal-title">
          {{ isEditing ? t('orgchart.editEmployee') : t('orgchart.addEmployee') }}
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
        <!-- Name -->
        <div>
          <label class="input-label">{{ t('orgchart.employeeName') }}</label>
          <input v-model="form.name" type="text" class="input" required />
        </div>

        <!-- Position & Department -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('orgchart.position') }}</label>
            <select v-model="form.position" class="select">
              <option v-for="opt in positionOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="input-label">{{ t('orgchart.department') }}</label>
            <select v-model="form.department" class="select">
              <option v-for="dept in departmentOptions" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
          </div>
        </div>

        <!-- Manager -->
        <div>
          <label class="input-label">Manager</label>
          <select v-model="form.managerId" class="select">
            <option :value="null">{{ t('common.none') }}</option>
            <option 
              v-for="manager in potentialManagers" 
              :key="manager.id" 
              :value="manager.id"
            >
              {{ manager.name }} ({{ t(`orgchart.${manager.position}`) }})
            </option>
          </select>
        </div>

        <!-- Contact -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="input-label">{{ t('orgchart.email') }}</label>
            <input v-model="form.email" type="email" class="input" />
          </div>
          <div>
            <label class="input-label">{{ t('orgchart.phone') }}</label>
            <input v-model="form.phone" type="tel" class="input" />
          </div>
        </div>

        <!-- Responsibilities (AZ) -->
        <div>
          <label class="input-label">{{ t('orgchart.responsibilities') }} (AZ)</label>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="newResponsibility" 
              type="text" 
              class="input flex-1"
              @keyup.enter.prevent="addResponsibility"
            />
            <button type="button" class="btn-primary" @click="addResponsibility">+</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(resp, index) in form.responsibilities" 
              :key="index"
              class="badge badge-gray flex items-center gap-1"
            >
              {{ resp }}
              <button type="button" @click="removeResponsibility(index)" class="ml-1 hover:text-red-500">×</button>
            </span>
          </div>
        </div>

        <!-- Responsibilities (EN) -->
        <div>
          <label class="input-label">{{ t('orgchart.responsibilities') }} (EN)</label>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="newResponsibilityEn" 
              type="text" 
              class="input flex-1"
              @keyup.enter.prevent="addResponsibilityEn"
            />
            <button type="button" class="btn-primary" @click="addResponsibilityEn">+</button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(resp, index) in form.responsibilitiesEn" 
              :key="index"
              class="badge badge-gray flex items-center gap-1"
            >
              {{ resp }}
              <button type="button" @click="removeResponsibilityEn(index)" class="ml-1 hover:text-red-500">×</button>
            </span>
          </div>
        </div>

        <!-- Color -->
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
      <div class="modal-footer sticky bottom-0 bg-white dark:bg-gray-800">
        <button 
          v-if="isEditing && form.managerId !== null"
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
