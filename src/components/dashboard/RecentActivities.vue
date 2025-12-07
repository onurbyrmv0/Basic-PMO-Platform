<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../stores/projectStore'
import {
  FolderPlusIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  UserPlusIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const activities = computed(() => {
  // Mock activities - in real app, these would come from a store
  const data = [
    {
      id: 1,
      type: 'project_created',
      title: locale.value === 'az' ? 'Yeni layihə yaradıldı' : 'New project created',
      description: 'ERP Sistemi Tətbiqi',
      time: '2 saat əvvəl',
      timeEn: '2 hours ago',
      icon: FolderPlusIcon,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'task_completed',
      title: locale.value === 'az' ? 'Tapşırıq tamamlandı' : 'Task completed',
      description: 'Tələblərin toplanması',
      time: '4 saat əvvəl',
      timeEn: '4 hours ago',
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      id: 3,
      type: 'status_changed',
      title: locale.value === 'az' ? 'Status dəyişdirildi' : 'Status changed',
      description: 'Mobil Tətbiq → Davam edir',
      time: '1 gün əvvəl',
      timeEn: '1 day ago',
      icon: ArrowPathIcon,
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      type: 'member_added',
      title: locale.value === 'az' ? 'Komandaya üzv əlavə edildi' : 'Team member added',
      description: 'Leyla Əliyeva',
      time: '2 gün əvvəl',
      timeEn: '2 days ago',
      icon: UserPlusIcon,
      color: 'bg-purple-500'
    },
    {
      id: 5,
      type: 'deadline_approaching',
      title: locale.value === 'az' ? 'Son tarix yaxınlaşır' : 'Deadline approaching',
      description: 'Təhlükəsizlik Auditi - 5 gün qalıb',
      time: '3 gün əvvəl',
      timeEn: '3 days ago',
      icon: ClockIcon,
      color: 'bg-red-500'
    }
  ]
  return data
})
</script>

<template>
  <div class="card">
    <h3 class="card-header">{{ t('dashboard.recentActivities') }}</h3>
    
    <div class="space-y-4">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <!-- Icon -->
        <div 
          class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          :class="activity.color"
        >
          <component :is="activity.icon" class="w-5 h-5 text-white" />
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ activity.title }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
            {{ activity.description }}
          </p>
        </div>
        
        <!-- Time -->
        <span class="text-xs text-gray-400 flex-shrink-0">
          {{ locale === 'az' ? activity.time : activity.timeEn }}
        </span>
      </div>
    </div>
    
    <!-- View All -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
        {{ t('common.view') }} {{ t('common.all') }} →
      </button>
    </div>
  </div>
</template>
