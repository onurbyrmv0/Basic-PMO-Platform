<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCalculatorStore } from '../../stores/calculatorStore'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const calculatorStore = useCalculatorStore()

const calculations = computed(() => calculatorStore.roiCalculations)

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
        {{ t('calculator.roi.title') }}
      </h3>
      
      <!-- Investment -->
      <div>
        <label class="input-label">{{ t('calculator.roi.investment') }} (₼)</label>
        <input 
          :value="calculatorStore.roiData.investment"
          @input="calculatorStore.updateRoiData('investment', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Expected Return -->
      <div>
        <label class="input-label">{{ t('calculator.roi.expectedReturn') }} (₼)</label>
        <input 
          :value="calculatorStore.roiData.expectedReturn"
          @input="calculatorStore.updateRoiData('expectedReturn', $event.target.value)"
          type="number" 
          class="input" 
          min="0"
        />
      </div>

      <!-- Timeframe -->
      <div>
        <label class="input-label">{{ locale === 'az' ? 'Müddət (ay)' : 'Timeframe (months)' }}</label>
        <input 
          :value="calculatorStore.roiData.timeframemonths"
          @input="calculatorStore.updateRoiData('timeframemonths', $event.target.value)"
          type="number" 
          class="input" 
          min="1"
        />
      </div>

      <!-- Discount Rate -->
      <div>
        <label class="input-label">
          {{ locale === 'az' ? 'Diskont dərəcəsi' : 'Discount Rate' }} ({{ calculatorStore.roiData.discountRate }}%)
        </label>
        <input 
          :value="calculatorStore.roiData.discountRate"
          @input="calculatorStore.updateRoiData('discountRate', $event.target.value)"
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

      <!-- KPI Cards -->
      <div class="grid grid-cols-2 gap-4">
        <!-- ROI -->
        <div 
          class="rounded-xl p-4"
          :class="parseFloat(calculations.roi) >= 0 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'"
        >
          <div class="flex items-center gap-2">
            <component 
              :is="parseFloat(calculations.roi) >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon"
              class="w-5 h-5"
              :class="parseFloat(calculations.roi) >= 0 ? 'text-green-600' : 'text-red-600'"
            />
            <span 
              class="text-sm"
              :class="parseFloat(calculations.roi) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ t('calculator.roi.roi') }}
            </span>
          </div>
          <p 
            class="text-3xl font-bold mt-2"
            :class="parseFloat(calculations.roi) >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'"
          >
            {{ calculations.roi }}%
          </p>
        </div>
        
        <!-- Profit -->
        <div 
          class="rounded-xl p-4"
          :class="calculations.profit >= 0 
            ? 'bg-blue-50 dark:bg-blue-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'"
        >
          <div class="flex items-center gap-2">
            <BanknotesIcon class="w-5 h-5 text-blue-600" />
            <span class="text-sm text-blue-600 dark:text-blue-400">
              {{ locale === 'az' ? 'Mənfəət' : 'Profit' }}
            </span>
          </div>
          <p 
            class="text-2xl font-bold mt-2"
            :class="calculations.profit >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'"
          >
            {{ formatCurrency(calculations.profit) }}
          </p>
        </div>
        
        <!-- Payback Period -->
        <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
          <div class="flex items-center gap-2">
            <ClockIcon class="w-5 h-5 text-purple-600" />
            <span class="text-sm text-purple-600 dark:text-purple-400">
              {{ t('calculator.roi.paybackPeriod') }}
            </span>
          </div>
          <p class="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">
            {{ calculations.paybackPeriod }} {{ t('calculator.roi.months') }}
          </p>
        </div>
        
        <!-- NPV -->
        <div 
          class="rounded-xl p-4"
          :class="calculations.isPositiveNPV 
            ? 'bg-emerald-50 dark:bg-emerald-900/20' 
            : 'bg-orange-50 dark:bg-orange-900/20'"
        >
          <div class="flex items-center gap-2">
            <span 
              class="text-sm"
              :class="calculations.isPositiveNPV ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'"
            >
              {{ t('calculator.roi.npv') }}
            </span>
          </div>
          <p 
            class="text-2xl font-bold mt-2"
            :class="calculations.isPositiveNPV ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'"
          >
            {{ formatCurrency(parseFloat(calculations.npv)) }}
          </p>
        </div>
      </div>

      <!-- Recommendation -->
      <div 
        class="rounded-xl p-6 border-2"
        :class="parseFloat(calculations.roi) >= 15 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
          : parseFloat(calculations.roi) >= 0 
            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
            : 'border-red-500 bg-red-50 dark:bg-red-900/10'"
      >
        <h4 
          class="font-semibold text-lg mb-2"
          :class="parseFloat(calculations.roi) >= 15 
            ? 'text-green-700 dark:text-green-400' 
            : parseFloat(calculations.roi) >= 0 
              ? 'text-yellow-700 dark:text-yellow-400'
              : 'text-red-700 dark:text-red-400'"
        >
          {{ parseFloat(calculations.roi) >= 15 
            ? (locale === 'az' ? '✓ Tövsiyə olunur' : '✓ Recommended') 
            : parseFloat(calculations.roi) >= 0 
              ? (locale === 'az' ? '⚠ Orta gəlirlilik' : '⚠ Moderate Return')
              : (locale === 'az' ? '✗ Tövsiyə olunmur' : '✗ Not Recommended')
          }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ parseFloat(calculations.roi) >= 15 
            ? (locale === 'az' 
              ? 'Bu layihə yaxşı investisiya imkanı təqdim edir. ROI 15%-dən yuxarıdır və NPV müsbətdir.' 
              : 'This project offers a good investment opportunity. ROI is above 15% and NPV is positive.')
            : parseFloat(calculations.roi) >= 0 
              ? (locale === 'az' 
                ? 'Bu layihə müsbət gəlir gətirəcək, lakin gəlirlilik dərəcəsi orta səviyyədədir.' 
                : 'This project will generate positive returns, but the profitability is moderate.')
              : (locale === 'az' 
                ? 'Bu layihə mənfi gəlir göstərir. İnvestisiya tövsiyə olunmur.' 
                : 'This project shows negative returns. Investment is not recommended.')
          }}
        </p>
      </div>

      <!-- Summary -->
      <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ t('calculator.roi.investment') }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.roiData.investment) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ t('calculator.roi.expectedReturn') }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculatorStore.roiData.expectedReturn) }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600 dark:text-gray-400">{{ locale === 'az' ? 'Aylıq gəlir' : 'Monthly Return' }}</span>
          <span class="font-medium text-gray-900 dark:text-white">
            {{ formatCurrency(calculations.monthlyReturn) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
