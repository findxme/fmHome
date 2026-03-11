<template>
  <div
    class="pull-refresh-container"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- 下拉提示 -->
    <div
      class="pull-refresh-indicator"
      :style="{ height: Math.max(0, pullDistance) + 'px', opacity: pullDistance / threshold }"
    >
      <div class="flex items-center justify-center h-full">
        <div v-if="refreshing" class="animate-spin text-2xl">🔄</div>
        <div v-else class="text-gray-500 dark:text-gray-400 text-sm">
          {{ pullDistance >= threshold ? '松开刷新' : '下拉刷新' }}
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div
      class="pull-refresh-content"
      :style="{ transform: `translateY(${Math.max(0, pullDistance)}px)` }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  threshold: {
    type: Number,
    default: 60
  }
})

const emit = defineEmits(['refresh'])

const pullDistance = ref(0)
const refreshing = ref(false)
const startY = ref(0)
const isDragging = ref(false)

const handleTouchStart = (e) => {
  if (refreshing.value) return
  startY.value = e.touches[0].clientY
  isDragging.value = true
}

const handleTouchMove = (e) => {
  if (!isDragging.value || refreshing.value) return

  const currentY = e.touches[0].clientY
  const diff = currentY - startY.value

  // 只有向下拉且滚动条在顶部时才触发
  if (diff > 0 && window.scrollY <= 0) {
    e.preventDefault()
    pullDistance.value = Math.min(diff * 0.5, props.threshold * 2)
  }
}

const handleTouchEnd = async () => {
  if (!isDragging.value) return
  isDragging.value = false

  if (pullDistance.value >= props.threshold && !refreshing.value) {
    refreshing.value = true
    try {
      await emit('refresh')
    } finally {
      refreshing.value = false
    }
  }

  pullDistance.value = 0
}

// 鼠标事件（桌面端）
const handleMouseDown = (e) => {
  if (refreshing.value) return
  startY.value = e.clientY
  isDragging.value = true
}

const handleMouseMove = (e) => {
  if (!isDragging.value || refreshing.value) return

  const currentY = e.clientY
  const diff = currentY - startY.value

  if (diff > 0 && window.scrollY <= 0) {
    e.preventDefault()
    pullDistance.value = Math.min(diff * 0.5, props.threshold * 2)
  }
}

const handleMouseUp = async () => {
  if (!isDragging.value) return
  isDragging.value = false

  if (pullDistance.value >= props.threshold && !refreshing.value) {
    refreshing.value = true
    try {
      await emit('refresh')
    } finally {
      refreshing.value = false
    }
  }

  pullDistance.value = 0
}
</script>

<style scoped>
.pull-refresh-container {
  position: relative;
  overflow: hidden;
}

.pull-refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  transition: height 0.2s ease;
}

.pull-refresh-content {
  transition: transform 0.2s ease;
}
</style>