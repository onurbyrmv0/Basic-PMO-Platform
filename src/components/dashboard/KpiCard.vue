<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  color: {
    type: String,
    default: 'primary'
  },
  change: String,
  changeType: {
    type: String,
    default: 'neutral' // 'up', 'down', 'neutral'
  },
  subtitle: String
})

const colorClasses = computed(() => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600'
  }
  return colors[props.color] || colors.primary
})

const borderColor = computed(() => {
  const colors = {
    primary: 'border-l-primary-500',
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    red: 'border-l-red-500',
    purple: 'border-l-purple-500',
    orange: 'border-l-orange-500',
    yellow: 'border-l-yellow-500'
  }
  return colors[props.color] || colors.primary
})
</script>

<template>
  <div class="card border-l-4 hover:scale-105 transition-transform duration-200" :class="borderColor">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ title }}
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {{ value }}
        </p>
        
        <!-- Change indicator -->
        <div v-if="change" class="flex items-center gap-1 mt-2">
          <span 
            class="text-sm font-medium"
            :class="{
              'text-green-500': changeType === 'up',
              'text-red-500': changeType === 'down',
              'text-gray-500': changeType === 'neutral'
            }"
          >
            <span v-if="changeType === 'up'">↑</span>
            <span v-else-if="changeType === 'down'">↓</span>
            {{ change }}
          </span>
          <span class="text-xs text-gray-400">vs last month</span>
        </div>
        
        <!-- Subtitle -->
        <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ subtitle }}
        </p>
      </div>
      
      <!-- Icon -->
      <div 
        class="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center"
        :class="colorClasses"
      >
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
</template>
