<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { HomeIcon } from '@heroicons/vue/24/outline'

const { locale } = useI18n()
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div class="text-9xl font-bold text-primary-500 mb-4">404</div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {{ locale === 'az' ? 'Səhifə tapılmadı' : 'Page not found' }}
      </h1>
      <p class="text-gray-500 dark:text-gray-400 mb-8">
        {{ locale === 'az' 
          ? 'Axtardığınız səhifə mövcud deyil və ya silinmişdir.' 
          : 'The page you are looking for does not exist or has been removed.' }}
      </p>
      <button 
        class="btn-primary inline-flex items-center gap-2"
        @click="goHome"
      >
        <HomeIcon class="w-5 h-5" />
        {{ locale === 'az' ? 'Ana Səhifəyə Qayıt' : 'Go to Home' }}
      </button>
    </div>
  </div>
</template>
