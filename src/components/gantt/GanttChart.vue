<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  viewScale: {
    type: String,
    default: 'week'
  },
  showDependencies: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['task-click', 'task-update'])
const { t, locale } = useI18n()

const containerRef = ref(null)

// Calculate timeline range
const timelineRange = computed(() => {
  if (props.tasks.length === 0) {
    const today = dayjs()
    return {
      start: today.subtract(1, 'week'),
      end: today.add(2, 'months')
    }
  }

  let minDate = dayjs(props.tasks[0].startDate)
  let maxDate = dayjs(props.tasks[0].endDate)

  props.tasks.forEach(task => {
    const start = dayjs(task.startDate)
    const end = dayjs(task.endDate)
    if (start.isBefore(minDate)) minDate = start
    if (end.isAfter(maxDate)) maxDate = end
  })

  return {
    start: minDate.subtract(1, 'week'),
    end: maxDate.add(2, 'weeks')
  }
})

// Generate timeline columns
const timelineColumns = computed(() => {
  const columns = []
  let current = timelineRange.value.start
  const end = timelineRange.value.end

  while (current.isBefore(end) || current.isSame(end)) {
    const isToday = current.isSame(dayjs(), 'day')
    
    if (props.viewScale === 'day') {
      columns.push({
        date: current.toDate(),
        label: current.format('D'),
        sublabel: current.format('ddd'),
        isToday,
        width: 40
      })
      current = current.add(1, 'day')
    } else if (props.viewScale === 'week') {
      columns.push({
        date: current.toDate(),
        label: current.format('D MMM'),
        // avoid using `week()` which requires the dayjs week plugin
        sublabel: current.format('MMM D'),
        isToday,
        width: 80
      })
      current = current.add(1, 'week')
    } else {
      columns.push({
        date: current.toDate(),
        label: current.format('MMM YYYY'),
        sublabel: '',
        isToday: current.isSame(dayjs(), 'month'),
        width: 120
      })
      current = current.add(1, 'month')
    }
  }

  return columns
})

// Calculate task position and width
function getTaskStyle(task) {
  const start = dayjs(task.startDate)
  const end = dayjs(task.endDate)
  const totalDays = timelineRange.value.end.diff(timelineRange.value.start, 'day')
  const startOffset = start.diff(timelineRange.value.start, 'day')
  const duration = end.diff(start, 'day') + 1

  const columnWidth = props.viewScale === 'day' ? 40 : props.viewScale === 'week' ? 80 / 7 : 120 / 30
  
  return {
    left: `${startOffset * columnWidth}px`,
    width: `${Math.max(duration * columnWidth, 30)}px`,
    backgroundColor: task.milestone ? '#f59e0b' : task.color || '#3b82f6'
  }
}

function handleTaskClick(task) {
  emit('task-click', task)
}

function formatDate(date) {
  return dayjs(date).format('D MMM')
}
</script>

<template>
  <div class="card p-0 overflow-hidden">
    <div class="gantt-container" ref="containerRef">
      <!-- Header -->
      <div class="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 bg-white dark:bg-gray-800">
        <!-- Task name column -->
        <div class="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700 font-medium text-gray-700 dark:text-gray-300">
          {{ t('gantt.taskName') }}
        </div>
        <!-- Timeline header -->
        <div class="flex-1 overflow-x-auto">
          <div class="flex">
            <div
              v-for="(col, index) in timelineColumns"
              :key="index"
              class="flex-shrink-0 p-2 text-center border-r border-gray-100 dark:border-gray-700"
              :class="{ 'bg-primary-50 dark:bg-primary-900/20': col.isToday }"
              :style="{ width: col.width + 'px' }"
            >
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ col.label }}</div>
              <div class="text-xs text-gray-500">{{ col.sublabel }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task rows -->
      <div class="divide-y divide-gray-100 dark:divide-gray-700">
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
        >
          <!-- Task info -->
          <div class="w-64 flex-shrink-0 p-3 border-r border-gray-200 dark:border-gray-700">
            <div class="flex items-center gap-2">
              <div 
                class="w-2 h-2 rounded-full flex-shrink-0"
                :style="{ backgroundColor: task.color }"
              />
              <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ locale === 'az' ? task.name : task.nameEn }}
              </span>
              <span v-if="task.milestone" class="text-xs text-amber-600 dark:text-amber-400">◆</span>
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}
            </div>
          </div>

          <!-- Timeline -->
          <div class="flex-1 overflow-x-auto">
            <div class="relative h-14 flex">
              <!-- Grid columns -->
              <div
                v-for="(col, index) in timelineColumns"
                :key="index"
                class="flex-shrink-0 border-r border-gray-100 dark:border-gray-700"
                :class="{ 'bg-primary-50/50 dark:bg-primary-900/10': col.isToday }"
                :style="{ width: col.width + 'px' }"
              />
              
              <!-- Task bar -->
              <div
                class="absolute top-3 h-8 rounded-md cursor-pointer flex items-center justify-center group transition-all hover:opacity-90"
                :class="{ 'rounded-full w-8 h-8': task.milestone }"
                :style="getTaskStyle(task)"
                @click="handleTaskClick(task)"
              >
                <!-- Progress overlay -->
                <div 
                  v-if="!task.milestone"
                  class="absolute left-0 top-0 h-full rounded-l-md bg-black/20"
                  :style="{ width: task.progress + '%' }"
                />
                
                <!-- Task label -->
                <span 
                  v-if="!task.milestone"
                  class="relative z-10 text-xs font-medium text-white px-2 truncate"
                >
                  {{ task.progress }}%
                </span>
                <span v-else class="text-white font-bold">◆</span>
                
                <!-- Tooltip -->
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  <div class="font-medium">{{ locale === 'az' ? task.name : task.nameEn }}</div>
                  <div class="text-gray-300">{{ task.assignee }}</div>
                  <div class="text-gray-400">{{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="tasks.length === 0" class="p-8 text-center text-gray-500">
        {{ t('common.noData') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.gantt-container {
  max-height: calc(100vh - 300px);
  overflow: auto;
}
</style>
