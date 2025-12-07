<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalculatorStore } from '../../stores/calculatorStore'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const { t, locale } = useI18n()
const calculatorStore = useCalculatorStore()

const chartData = computed(() => {
  const breakdown = calculatorStore.budgetCalculations.breakdown
  return {
    labels: breakdown.map(b => locale.value === 'az' ? b.name : b.nameEn),
    datasets: [{
      data: breakdown.map(b => b.value),
      backgroundColor: [
        '#3b82f6',
        '#22c55e',
        '#f59e0b',
        '#8b5cf6',
        '#ef4444'
      ],
      borderWidth: 0
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        usePointStyle: true
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.raw
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percent = ((value / total) * 100).toFixed(1)
          return `₼${value.toLocaleString()} (${percent}%)`
        }
      }
    }
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat(locale.value === 'az' ? 'az-AZ' : 'en-US', {
    style: 'currency',
    currency: 'AZN',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Input Form -->
    <div class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('calculator.budget.title') }}
      </h3>
      
      <!-- Labor Cost -->
      <div>
        <label class="input-label">{{ t('calculator.budget.laborCost') }} (₼)</label>
        <input 
          :value="calculatorStore.budgetData.laborCost"
          @input="calculatorStore.updateBudgetData('laborCost', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Material Cost -->
      <div>
        <label class="input-label">{{ t('calculator.budget.materialCost') }} (₼)</label>
        <input 
          :value="calculatorStore.budgetData.materialCost"
          @input="calculatorStore.updateBudgetData('materialCost', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Equipment Cost -->
      <div>
        <label class="input-label">{{ t('calculator.budget.equipmentCost') }} (₼)</label>
        <input 
          :value="calculatorStore.budgetData.equipmentCost"
          @input="calculatorStore.updateBudgetData('equipmentCost', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Overhead Cost -->
      <div>
        <label class="input-label">{{ t('calculator.budget.overheadCost') }} (₼)</label>
        <input 
          :value="calculatorStore.budgetData.overheadCost"
          @input="calculatorStore.updateBudgetData('overheadCost', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Contingency -->
      <div>
        <label class="input-label">
          {{ t('calculator.budget.contingency') }} ({{ calculatorStore.budgetData.contingencyPercent }}%)
        </label>
        <input 
          :value="calculatorStore.budgetData.contingencyPercent"
          @input="calculatorStore.updateBudgetData('contingencyPercent', $event.target.value)"
          type="range" 
          class="w-full accent-primary-600"
          min="0"
          max="30"
        />
      </div>
    </div>

    <!-- Results -->
    <div class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ locale === 'az' ? 'Nəticələr' : 'Results' }}
      </h3>

      <!-- Chart -->
      <div class="h-64">
        <Pie :data="chartData" :options="chartOptions" />
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
        <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-600">
          <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.budgetCalculations.subtotal) }}
          </span>
        </div>
        
        <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-600">
          <span class="text-gray-600 dark:text-gray-400">
            {{ t('calculator.budget.contingency') }} ({{ calculatorStore.budgetData.contingencyPercent }}%)
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.budgetCalculations.contingency) }}
          </span>
        </div>
        
        <div class="flex justify-between items-center pt-2">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('calculator.budget.totalBudget') }}
          </span>
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ formatCurrency(calculatorStore.budgetCalculations.total) }}
          </span>
        </div>
      </div>

      <!-- Breakdown table -->
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>{{ locale === 'az' ? 'Kateqoriya' : 'Category' }}</th>
              <th class="text-right">{{ locale === 'az' ? 'Məbləğ' : 'Amount' }}</th>
              <th class="text-right">%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in calculatorStore.budgetCalculations.breakdown" :key="item.name">
              <td>{{ locale === 'az' ? item.name : item.nameEn }}</td>
              <td class="text-right font-medium">{{ formatCurrency(item.value) }}</td>
              <td class="text-right text-gray-500">{{ item.percent }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
