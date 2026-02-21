<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
    <!-- 阶段标签 -->
    <div
      class="px-4 py-2 flex items-center gap-2"
      :class="getPhaseColor(step.phase)"
    >
      <span class="text-lg">{{ getPhaseIcon(step.phase) }}</span>
      <span class="font-medium text-white">{{ step.phase }}</span>
      <span v-if="step.duration" class="ml-auto text-white/90 text-sm">
        ⏱️ {{ step.duration }}
      </span>
    </div>

    <!-- 步骤内容 -->
    <div class="p-4">
      <h4 class="font-semibold text-gray-800 mb-2">{{ step.title }}</h4>
      <p class="text-gray-600 mb-3">{{ step.description }}</p>

      <!-- 所需厨具 -->
      <div v-if="step.requiredTools && step.requiredTools.length" class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tool in step.requiredTools"
          :key="tool"
          class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          {{ tool }}
        </span>
      </div>

      <!-- 小贴士 -->
      <div
        v-if="step.tips"
        class="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg"
      >
        <span class="text-yellow-500 text-lg">💡</span>
        <p class="text-sm text-yellow-700">{{ step.tips }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  step: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const getPhaseColor = (phase) => {
  const colors = {
    '备菜': 'bg-blue-500',
    '主料': 'bg-orange-500',
    '收尾': 'bg-green-500'
  }
  return colors[phase] || 'bg-gray-500'
}

const getPhaseIcon = (phase) => {
  const icons = {
    '备菜': '🔪',
    '主料': '🍳',
    '收尾': '✨'
  }
  return icons[phase] || '📝'
}
</script>
