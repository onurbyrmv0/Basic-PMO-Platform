<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEmployeeStore } from '../stores/employeeStore'
import { useExport } from '../composables/useExport'
import OrgChartTree from '../components/orgchart/OrgChartTree.vue'
import EmployeeModal from '../components/orgchart/EmployeeModal.vue'
import {
  PlusIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const employeeStore = useEmployeeStore()
const { exportOrgChartToPDF } = useExport()

const showModal = ref(false)
const editingEmployee = ref(null)
const orgChartContainer = ref(null)

onMounted(() => {
  employeeStore.loadFromLocalStorage()
})

function openCreateModal() {
  editingEmployee.value = null
  showModal.value = true
}

function openEditModal(employee) {
  editingEmployee.value = employee
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingEmployee.value = null
}

function handleSave(employee) {
  if (editingEmployee.value) {
    employeeStore.updateEmployee(editingEmployee.value.id, employee)
  } else {
    employeeStore.addEmployee(employee)
  }
  closeModal()
}

function handleDelete(id) {
  if (confirm('Delete this employee?')) {
    employeeStore.deleteEmployee(id)
    closeModal()
  }
}

function exportChart() {
  const el = orgChartContainer.value
  if (!el) return
  exportOrgChartToPDF(el)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('orgchart.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ employeeStore.totalEmployees }} {{ t('dashboard.teamMembers').toLowerCase() }}
        </p>
      </div>
      <button class="btn-primary flex items-center gap-2" @click="openCreateModal">
        <PlusIcon class="w-5 h-5" />
        {{ t('orgchart.addEmployee') }}
      </button>
    </div>

    <!-- Controls -->
    <div class="card">
      <div class="flex items-center justify-between">
        <!-- Zoom level -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Zoom: {{ Math.round(employeeStore.zoomLevel * 100) }}%</span>
        </div>

        <!-- Control buttons -->
        <div class="flex items-center gap-2">
          <button 
            class="btn-ghost btn-icon"
            :title="t('orgchart.zoomIn')"
            @click="employeeStore.zoomIn"
          >
            <MagnifyingGlassPlusIcon class="w-5 h-5" />
          </button>
          
          <button 
            class="btn-ghost btn-icon"
            :title="t('orgchart.zoomOut')"
            @click="employeeStore.zoomOut"
          >
            <MagnifyingGlassMinusIcon class="w-5 h-5" />
          </button>
          
          <button 
            class="btn-ghost btn-icon"
            :title="t('orgchart.fitToScreen')"
            @click="employeeStore.resetZoom"
          >
            <ArrowsPointingOutIcon class="w-5 h-5" />
          </button>

          <div class="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

          <button 
            class="btn-ghost btn-icon"
            :title="t('orgchart.export')"
            @click="exportChart"
          >
            <DocumentArrowDownIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Org Chart -->
    <div class="card overflow-x-auto" ref="orgChartContainer">
      <div 
        class="min-w-max transition-transform duration-200 origin-top-left p-8"
        :style="{ transform: `scale(${employeeStore.zoomLevel})` }"
      >
        <OrgChartTree 
          v-if="employeeStore.orgChartData"
          :node="employeeStore.orgChartData"
          @node-click="openEditModal"
        />
        
        <div v-else class="text-center py-12 text-gray-500">
          {{ t('common.noData') }}
        </div>
      </div>
    </div>

    <!-- Employee Modal -->
    <EmployeeModal
      v-if="showModal"
      :employee="editingEmployee"
      @close="closeModal"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>
