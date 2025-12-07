<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/appStore'
import {
  HomeIcon,
  FolderIcon,
  ChartBarIcon,
  UserGroupIcon,
  CalculatorIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()

const navItems = computed(() => [
  { name: t('nav.dashboard'), path: '/', icon: HomeIcon },
  { name: t('nav.projects'), path: '/projects', icon: FolderIcon },
  { name: t('nav.gantt'), path: '/gantt', icon: ChartBarIcon },
  { name: t('nav.orgchart'), path: '/orgchart', icon: UserGroupIcon },
  { name: t('nav.calculator'), path: '/calculator', icon: CalculatorIcon },
  { name: t('nav.workflow'), path: '/workflow', icon: ArrowPathIcon },
  { name: t('nav.settings'), path: '/settings', icon: Cog6ToothIcon }
])

function isActive(path) {
  return route.path === path
}
</script>

<template>
  <aside 
    class="sidebar"
    :class="{ '-translate-x-full': !appStore.sidebarOpen, 'translate-x-0': appStore.sidebarOpen }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
          <span class="text-white font-bold text-lg">P</span>
        </div>
        <div>
          <h1 class="font-bold text-gray-900 dark:text-white">PMO</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400">Platform</p>
        </div>
      </div>
      <button 
        class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        @click="appStore.toggleSidebar"
      >
        <XMarkIcon class="w-5 h-5 text-gray-500" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-1">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        :class="{ active: isActive(item.path) }"
        @click="appStore.sidebarOpen && window.innerWidth < 1024 && appStore.toggleSidebar()"
      >
        <component :is="item.icon" class="sidebar-link-icon" />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <span class="text-white font-medium">PM</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">PMO Admin</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">admin@pmo.az</p>
        </div>
      </div>
    </div>
  </aside>
</template>
