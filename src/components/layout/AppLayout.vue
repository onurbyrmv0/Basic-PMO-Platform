<script setup>
import { ref } from 'vue'
import { useAppStore } from '../../stores/appStore'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <AppSidebar />
    
    <!-- Main Content -->
    <div 
      class="transition-all duration-300"
      :class="appStore.sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'"
    >
      <!-- Header -->
      <AppHeader />
      
      <!-- Page Content -->
      <main class="p-4 lg:p-6 mt-16">
        <slot />
      </main>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="appStore.sidebarOpen"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="appStore.toggleSidebar"
    />
  </div>
</template>
