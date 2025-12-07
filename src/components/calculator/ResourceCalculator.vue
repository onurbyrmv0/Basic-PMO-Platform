<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalculatorStore } from '../../stores/calculatorStore'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const { t, locale } = useI18n()
const calculatorStore = useCalculatorStore()

const chartData = computed(() => {
  const calc = calculatorStore.resourceCalculations
  const labels = locale.value === 'az' 
    ? ['Günlük', 'Həftəlik', 'Aylıq', 'Ümumi']
    : ['Daily', 'Weekly', 'Monthly', 'Total']
  
  return {
    labels,
    datasets: [{
      label: locale.value === 'az' ? 'Xərc (₼)' : 'Cost (₼)',
      data: [calc.breakdown.daily, calc.breakdown.weekly, calc.breakdown.monthly, calc.breakdown.total],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
      borderRadius: 8
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `₼${context.raw.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '₼' + value.toLocaleString()
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
        {{ t('calculator.resource.title') }}
      </h3>
      
      <!-- Team Size -->
      <div>
        <label class="input-label">{{ t('calculator.resource.teamSize') }}</label>
        <input 
          :value="calculatorStore.resourceData.teamSize"
          @input="calculatorStore.updateResourceData('teamSize', $event.target.value)"
          type="number" 
          class="input" 
          min="1"
        />
      </div>

      <!-- Hourly Rate -->
      <div>
        <label class="input-label">{{ t('calculator.resource.hourlyRate') }} (₼)</label>
        <input 
          :value="calculatorStore.resourceData.hourlyRate"
          @input="calculatorStore.updateResourceData('hourlyRate', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Hours Per Day -->
      <div>
        <label class="input-label">{{ t('calculator.resource.hoursPerDay') }}</label>
        <input 
          :value="calculatorStore.resourceData.hoursPerDay"
          @input="calculatorStore.updateResourceData('hoursPerDay', $event.target.value)"
          type="number" 
          class="input" 
          min="1"
          max="24"
        />
      </div>

      <!-- Work Days -->
      <div>
        <label class="input-label">{{ t('calculator.resource.workDays') }} ({{ locale === 'az' ? 'ayda' : 'per month' }})</label>
        <input 
          :value="calculatorStore.resourceData.workDays"
          @input="calculatorStore.updateResourceData('workDays', $event.target.value)"
          type="number" 
          class="input" 
          min="1"
          max="31"
        />
      </div>

      <!-- Duration (Months) -->
      <div>
        <label class="input-label">{{ locale === 'az' ? 'Müddət (ay)' : 'Duration (months)' }}</label>
        <input 
          :value="calculatorStore.resourceData.months"
          @input="calculatorStore.updateResourceData('months', $event.target.value)"
          type="number" 
          class="input" 
          min="1"
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
        <Bar :data="chartData" :options="chartOptions" />
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
          <p class="text-sm text-blue-600 dark:text-blue-400">{{ t('calculator.resource.totalHours') }}</p>
          <p class="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
            {{ calculatorStore.resourceCalculations.totalHours.toLocaleString() }}
          </p>
        </div>
        
        <div class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
          <p class="text-sm text-green-600 dark:text-green-400">{{ t('calculator.resource.totalCost') }}</p>
          <p class="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
            {{ formatCurrency(calculatorStore.resourceCalculations.totalCost) }}
          </p>
        </div>
      </div>

      <!-- Details -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ locale === 'az' ? 'Aylıq saatlar' : 'Monthly Hours' }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ calculatorStore.resourceCalculations.totalHoursPerMonth.toLocaleString() }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ locale === 'az' ? 'Aylıq xərc' : 'Monthly Cost' }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.resourceCalculations.monthlyCost) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ locale === 'az' ? 'Nəfər başına xərc' : 'Cost per Person' }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.resourceCalculations.costPerPerson) }}
          </span>
        </div>
        <div class="pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between">
          <span class="font-semibold text-gray-900 dark:text-white">{{ t('calculator.resource.totalCost') }}</span>
          <span class="text-xl font-bold text-primary-600 dark:text-primary-400">
            {{ formatCurrency(calculatorStore.resourceCalculations.totalCost) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
