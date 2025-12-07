<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './stores/appStore'
import AppLayout from './components/layout/AppLayout.vue'
import ToastContainer from './components/common/ToastContainer.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.initTheme()
  appStore.initColorScheme()
})
</script>

<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </AppLayout>
  <ToastContainer />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
