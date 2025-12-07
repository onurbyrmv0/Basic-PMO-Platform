<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['node-click'])
const { t, locale } = useI18n()

function getPositionLabel(position) {
  return t(`orgchart.${position}`)
}

function handleClick() {
  emit('node-click', props.node)
}
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Node -->
    <div 
      class="org-node cursor-pointer hover:shadow-xl transition-all"
      :style="{ borderColor: node.color }"
      @click="handleClick"
    >
      <!-- Avatar -->
      <div 
        class="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
        :style="{ backgroundColor: node.color }"
      >
        {{ node.name.split(' ').map(n => n[0]).join('') }}
      </div>
      
      <!-- Name -->
      <h4 class="font-semibold text-gray-900 dark:text-white text-center">
        {{ node.name }}
      </h4>
      
      <!-- Position -->
      <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
        {{ getPositionLabel(node.position) }}
      </p>
      
      <!-- Department -->
      <span class="badge badge-primary mt-2 text-xs">
        {{ node.department }}
      </span>
    </div>

    <!-- Children -->
    <div v-if="node.children && node.children.length > 0" class="flex flex-col items-center">
      <!-- Vertical line down -->
      <div class="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
      
      <!-- Horizontal line -->
      <div 
        v-if="node.children.length > 1"
        class="h-0.5 bg-gray-300 dark:bg-gray-600"
        :style="{ 
          width: `${(node.children.length - 1) * 220 + 100}px`
        }"
      />
      
      <!-- Child nodes -->
      <div class="flex items-start gap-8">
        <div 
          v-for="child in node.children" 
          :key="child.id"
          class="flex flex-col items-center"
        >
          <!-- Vertical line to child -->
          <div class="w-0.5 h-8 bg-gray-300 dark:bg-gray-600" />
          
          <!-- Recursive child tree -->
          <OrgChartTree 
            :node="child"
            @node-click="(emp) => emit('node-click', emp)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
