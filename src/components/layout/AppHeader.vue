<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/appStore'
import { setLocale, availableLocales, getLocale } from '../../i18n'
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
  BellIcon,
  LanguageIcon
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const appStore = useAppStore()

const showLangDropdown = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')

const currentLocale = computed(() => {
  return availableLocales.find(l => l.code === getLocale()) || availableLocales[0]
})

function changeLanguage(code) {
  setLocale(code)
  showLangDropdown.value = false
}

function toggleSearch() {
  // Could open a search modal
}
</script>

<template>
  <header class="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20 transition-all duration-300">
    <div class="flex items-center justify-between h-full px-4">
      <!-- Left side -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu button -->
        <button 
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="appStore.toggleSidebar"
        >
          <Bars3Icon class="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <!-- Search -->
        <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg w-64">
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400" />
          <input 
            v-model="searchQuery"
            type="text"
            :placeholder="t('common.search') + '...'"
            class="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Search button (mobile) -->
        <button 
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="toggleSearch"
        >
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <!-- Language Switcher -->
        <div class="relative">
          <button 
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            @click="showLangDropdown = !showLangDropdown"
          >
            <span class="text-lg">{{ currentLocale.flag }}</span>
            <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ currentLocale.code.toUpperCase() }}
            </span>
          </button>
          
          <!-- Dropdown -->
          <div 
            v-if="showLangDropdown"
            class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
          >
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              class="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-primary-50 dark:bg-primary-900/20': locale.code === currentLocale.code }"
              @click="changeLanguage(locale.code)"
            >
              <span class="text-lg">{{ locale.flag }}</span>
              <span class="text-sm text-gray-700 dark:text-gray-200">{{ locale.name }}</span>
            </button>
          </div>
        </div>

        <!-- Theme Toggle -->
        <button 
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="appStore.toggleTheme"
        >
          <SunIcon v-if="appStore.isDark" class="w-5 h-5 text-yellow-500" />
          <MoonIcon v-else class="w-5 h-5 text-gray-600" />
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button 
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            @click="showNotifications = !showNotifications"
          >
            <BellIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <!-- Notifications dropdown -->
          <div 
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ t('dashboard.recentActivities') }}</h3>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div class="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                {{ t('common.noData') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Click outside to close dropdowns -->
  <div 
    v-if="showLangDropdown || showNotifications"
    class="fixed inset-0 z-40"
    @click="showLangDropdown = false; showNotifications = false"
  />
</template>
