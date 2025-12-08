<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalculatorStore } from '../stores/calculatorStore'
import { useExport } from '../composables/useExport'
import BudgetCalculator from '../components/calculator/BudgetCalculator.vue'
import ResourceCalculator from '../components/calculator/ResourceCalculator.vue'
import RoiCalculator from '../components/calculator/RoiCalculator.vue'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const calculatorStore = useCalculatorStore()
const { exportCalculatorToExcel } = useExport()

onMounted(() => {
  calculatorStore.loadFromLocalStorage()
})

const tabs = [
  { id: 'budget', label: 'calculator.budget.title', icon: CurrencyDollarIcon },
  { id: 'resource', label: 'calculator.resource.title', icon: UserGroupIcon },
  { id: 'roi', label: 'calculator.roi.title', icon: ChartBarIcon }
]

function exportReport() {
  const type = calculatorStore.activeTab
  const dataMap = {
    budget: calculatorStore.budgetCalculations,
    resource: calculatorStore.resourceCalculations,
    roi: calculatorStore.roiCalculations
  }
  const data = dataMap[type]
  if (!data) return
  exportCalculatorToExcel(data, type)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ t('calculator.title') }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          {{ t('app.description') }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button 
          class="btn-secondary flex items-center gap-2"
          @click="calculatorStore.resetAll"
        >
          <ArrowPathIcon class="w-4 h-4" />
          {{ t('calculator.reset') }}
        </button>
        <button 
          class="btn-primary flex items-center gap-2"
          @click="exportReport"
        >
          <DocumentArrowDownIcon class="w-4 h-4" />
          {{ t('calculator.generateReport') }}
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="card p-0">
      <div class="tabs px-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab flex items-center gap-2"
          :class="{ active: calculatorStore.activeTab === tab.id }"
          @click="calculatorStore.setActiveTab(tab.id)"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ t(tab.label) }}
        </button>
      </div>

      <div class="p-6">
        <!-- Budget Calculator -->
        <BudgetCalculator v-if="calculatorStore.activeTab === 'budget'" />
        
        <!-- Resource Calculator -->
        <ResourceCalculator v-else-if="calculatorStore.activeTab === 'resource'" />
        
        <!-- ROI Calculator -->
        <RoiCalculator v-else-if="calculatorStore.activeTab === 'roi'" />
      </div>
    </div>
  </div>
</template>
