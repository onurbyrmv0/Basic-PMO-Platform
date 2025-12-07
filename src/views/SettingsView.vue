<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/appStore'
import {
  SunIcon,
  MoonIcon,
  LanguageIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  KeyIcon,
  Cog6ToothIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const appStore = useAppStore()

const activeTab = ref('general')

const tabs = computed(() => [
  { id: 'general', name: t('settings.general'), icon: Cog6ToothIcon },
  { id: 'appearance', name: t('settings.appearance'), icon: SunIcon },
  { id: 'export', name: t('settings.export'), icon: DocumentArrowDownIcon },
  { id: 'shortcuts', name: locale.value === 'az' ? 'Qısayollar' : 'Shortcuts', icon: KeyIcon },
  { id: 'about', name: t('settings.about'), icon: InformationCircleIcon }
])

const languages = [
  { code: 'az', name: 'Azərbaycan dili', flag: '🇦🇿' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
]

const themes = computed(() => [
  { id: 'light', name: t('settings.lightMode'), icon: SunIcon },
  { id: 'dark', name: t('settings.darkMode'), icon: MoonIcon }
])

const exportFormats = [
  { id: 'pdf', name: 'PDF', description: locale.value === 'az' ? 'Sənəd formatı' : 'Document format' },
  { id: 'excel', name: 'Excel', description: locale.value === 'az' ? 'Cədvəl formatı' : 'Spreadsheet format' },
  { id: 'png', name: 'PNG', description: locale.value === 'az' ? 'Şəkil formatı' : 'Image format' }
]

const shortcuts = computed(() => [
  { key: 'Ctrl + D', action: locale.value === 'az' ? 'Dark/Light rejim' : 'Toggle dark mode' },
  { key: 'Ctrl + L', action: locale.value === 'az' ? 'Dil dəyişdir' : 'Toggle language' },
  { key: 'Ctrl + S', action: locale.value === 'az' ? 'Sidebar aç/bağla' : 'Toggle sidebar' },
  { key: 'Ctrl + N', action: locale.value === 'az' ? 'Yeni layihə' : 'New project' },
  { key: 'Ctrl + F', action: locale.value === 'az' ? 'Axtarış' : 'Search' },
  { key: 'Ctrl + E', action: locale.value === 'az' ? 'İxrac et' : 'Export' }
])

const selectedExportFormat = ref('pdf')

function setLanguage(code) {
  appStore.setLocale(code)
}

function setTheme(themeId) {
  appStore.toggleTheme()
}

function clearAllData() {
  if (confirm(locale.value === 'az' 
    ? 'Bütün demo məlumatlar silinəcək. Əminsiniz?' 
    : 'All demo data will be cleared. Are you sure?')) {
    localStorage.clear()
    window.location.reload()
  }
}

function exportDemo() {
  appStore.showToast(
    locale.value === 'az' 
      ? `${selectedExportFormat.value.toUpperCase()} formatında ixrac edildi` 
      : `Exported in ${selectedExportFormat.value.toUpperCase()} format`,
    'success'
  )
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('settings.title') }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        {{ locale === 'az' ? 'Tətbiq parametrlərini tənzimləyin' : 'Configure application settings' }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Tabs -->
      <div class="card lg:col-span-1">
        <nav class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
            :class="activeTab === tab.id 
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span class="font-medium">{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="lg:col-span-3">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'" class="card">
          <h3 class="card-header">{{ t('settings.general') }}</h3>
          
          <div class="space-y-6">
            <!-- Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <div class="flex items-center gap-2">
                  <LanguageIcon class="w-5 h-5" />
                  {{ t('settings.language') }}
                </div>
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  class="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all"
                  :class="locale === lang.code 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                  @click="setLanguage(lang.code)"
                >
                  <span class="text-2xl">{{ lang.flag }}</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ lang.name }}</span>
                  <CheckIcon v-if="locale === lang.code" class="w-5 h-5 ml-auto text-primary-500" />
                </button>
              </div>
            </div>

            <!-- Data Management -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ locale === 'az' ? 'Məlumatların İdarəsi' : 'Data Management' }}
              </label>
              <button 
                class="btn-secondary flex items-center gap-2"
                @click="clearAllData"
              >
                <ArrowPathIcon class="w-5 h-5" />
                {{ locale === 'az' ? 'Demo məlumatları sıfırla' : 'Reset demo data' }}
              </button>
              <p class="text-sm text-gray-500 mt-2">
                {{ locale === 'az' 
                  ? 'Bu, bütün lokal məlumatları silib yenidən demo məlumatları yükləyəcək.' 
                  : 'This will clear all local data and reload demo data.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Appearance Settings -->
        <div v-if="activeTab === 'appearance'" class="card">
          <h3 class="card-header">{{ t('settings.appearance') }}</h3>
          
          <div class="space-y-6">
            <!-- Theme -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ locale === 'az' ? 'Tema' : 'Theme' }}
              </label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  v-for="theme in themes"
                  :key="theme.id"
                  class="relative flex flex-col items-center p-6 rounded-xl border-2 transition-all"
                  :class="appStore.theme === theme.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                  @click="theme.id !== appStore.theme && appStore.toggleTheme()"
                >
                  <div 
                    class="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
                    :class="theme.id === 'light' 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-gray-800 text-gray-200'"
                  >
                    <component :is="theme.icon" class="w-8 h-8" />
                  </div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ theme.name }}</span>
                  <div 
                    v-if="appStore.theme === theme.id"
                    class="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                  >
                    <CheckIcon class="w-4 h-4 text-white" />
                  </div>
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ locale === 'az' ? 'Önizləmə' : 'Preview' }}
              </label>
              <div 
                class="p-6 rounded-xl"
                :class="appStore.theme === 'dark' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white border border-gray-200 text-gray-900'"
              >
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                    AB
                  </div>
                  <div>
                    <div class="font-semibold">Demo User</div>
                    <div class="text-sm opacity-70">demo@example.com</div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-3 rounded bg-gray-300 dark:bg-gray-600" style="width: 80%"></div>
                  <div class="h-3 rounded bg-gray-300 dark:bg-gray-600" style="width: 60%"></div>
                  <div class="h-3 rounded bg-gray-300 dark:bg-gray-600" style="width: 70%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Export Settings -->
        <div v-if="activeTab === 'export'" class="card">
          <h3 class="card-header">{{ t('settings.export') }}</h3>
          
          <div class="space-y-6">
            <!-- Export Format -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {{ locale === 'az' ? 'İxrac formatı' : 'Export format' }}
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="format in exportFormats"
                  :key="format.id"
                  class="flex flex-col items-center p-4 rounded-xl border-2 transition-all"
                  :class="selectedExportFormat === format.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'"
                  @click="selectedExportFormat = format.id"
                >
                  <span class="text-lg font-bold text-gray-900 dark:text-white">{{ format.name }}</span>
                  <span class="text-xs text-gray-500 mt-1">{{ format.description }}</span>
                </button>
              </div>
            </div>

            <!-- Export Demo -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                class="btn-primary flex items-center gap-2"
                @click="exportDemo"
              >
                <DocumentArrowDownIcon class="w-5 h-5" />
                {{ locale === 'az' ? 'İxrac et' : 'Export' }}
              </button>
              <p class="text-sm text-gray-500 mt-2">
                {{ locale === 'az' 
                  ? 'Seçilmiş formatda cari görünüşü ixrac edin.' 
                  : 'Export the current view in the selected format.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Shortcuts -->
        <div v-if="activeTab === 'shortcuts'" class="card">
          <h3 class="card-header">{{ locale === 'az' ? 'Klaviatura Qısayolları' : 'Keyboard Shortcuts' }}</h3>
          
          <div class="space-y-3">
            <div 
              v-for="shortcut in shortcuts" 
              :key="shortcut.key"
              class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <span class="text-gray-700 dark:text-gray-300">{{ shortcut.action }}</span>
              <kbd class="px-3 py-1 text-sm font-mono bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>
        </div>

        <!-- About -->
        <div v-if="activeTab === 'about'" class="card">
          <h3 class="card-header">{{ t('settings.about') }}</h3>
          
          <div class="space-y-6">
            <div class="text-center py-8">
              <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white text-3xl font-bold mb-4">
                PMO
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ locale === 'az' ? 'Layihə Ofisi Platforması' : 'Project Office Platform' }}
              </h2>
              <p class="text-gray-500 mt-1">{{ locale === 'az' ? 'Versiya 1.0.0' : 'Version 1.0.0' }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div class="text-2xl font-bold text-primary-600">Vue 3</div>
                <div class="text-sm text-gray-500">Framework</div>
              </div>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div class="text-2xl font-bold text-primary-600">Vite</div>
                <div class="text-sm text-gray-500">Build Tool</div>
              </div>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div class="text-2xl font-bold text-primary-600">Tailwind</div>
                <div class="text-sm text-gray-500">CSS</div>
              </div>
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                <div class="text-2xl font-bold text-primary-600">Pinia</div>
                <div class="text-sm text-gray-500">State</div>
              </div>
            </div>

            <div class="text-center text-sm text-gray-500 pt-6 border-t border-gray-200 dark:border-gray-700">
              {{ locale === 'az' 
                ? 'PMO Demo Platforması - Prezentasiya üçün hazırlanmışdır' 
                : 'PMO Demo Platform - Created for presentation purposes' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
