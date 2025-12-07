<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../stores/appStore'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

const appStore = useAppStore()

const icons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon
}

function getIcon(type) {
  return icons[type] || InformationCircleIcon
}

function getClass(type) {
  const classes = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }
  return classes[type] || classes.info
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <transition-group name="toast">
      <div
        v-for="notification in appStore.notifications"
        :key="notification.id"
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white min-w-64 max-w-sm animate-slide-in"
        :class="getClass(notification.type)"
      >
        <component :is="getIcon(notification.type)" class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1 text-sm">{{ notification.message }}</span>
        <button 
          class="p-1 hover:bg-white/20 rounded"
          @click="appStore.removeNotification(notification.id)"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
