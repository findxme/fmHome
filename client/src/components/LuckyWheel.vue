<template>
  <div class="flex flex-col items-center justify-center p-4">
    <!-- 转盘 -->
    <div class="relative">
      <div
        class="w-64 h-64 rounded-full border-8 border-accent-500 flex items-center justify-center overflow-hidden shadow-2xl"
        :class="{ 'animate-spin': isSpinning }"
        :style="{ animationDuration: spinDuration + 'ms', animationPlayState: isSpinning ? 'running' : 'paused' }"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-accent-400 to-accent-600"></div>
        <div class="relative z-10 text-center p-4">
          <div class="text-4xl mb-2">{{ currentDish?.icon || '🍽️' }}</div>
          <div class="text-white font-bold text-lg">{{ currentDish?.name || '今天吃什么' }}</div>
        </div>
      </div>

      <!-- 指针 -->
      <div class="absolute -top-3 left-1/2 -translate-x-1/2 text-4xl z-20">👆</div>
    </div>

    <!-- 按钮 -->
    <button
      @click="spin"
      :disabled="isSpinning"
      class="mt-8 px-8 py-3 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ isSpinning ? '选择中...' : '🎲 随机选菜' }}
    </button>

    <!-- 推荐理由 -->
    <transition name="fade">
      <div v-if="currentDish && !isSpinning" class="mt-4 text-center">
        <p class="text-gray-600 dark:text-gray-300">{{ currentDish.reason }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  dishes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const isSpinning = ref(false)
const spinDuration = ref(2000)
const currentDish = ref(null)

// 随机选择
const spin = async () => {
  if (isSpinning.value || props.dishes.length === 0) return

  isSpinning.value = true

  // 随机动画时长
  const duration = 1500 + Math.random() * 1500
  spinDuration.value = duration

  // 快速切换菜品显示
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * props.dishes.length)
    currentDish.value = props.dishes[randomIndex]
  }, 100)

  // 动画结束后确定最终选择
  setTimeout(() => {
    clearInterval(interval)

    const finalIndex = Math.floor(Math.random() * props.dishes.length)
    currentDish.value = props.dishes[finalIndex]
    currentDish.value.reason = getRecommendReason(currentDish.value)

    isSpinning.value = false

    // 发出选中事件
    emit('select', currentDish.value)
  }, duration)
}

// 获取推荐理由
const getRecommendReason = (dish) => {
  const reasons = [
    '今天天气不错，适合吃这个！',
    '这道菜简单易做，非常适合今天的你~',
    '大数据推荐：这可能是你的菜！',
    '缘分到了，就选它吧！',
    '今日最佳选择，营养又美味！'
  ]
  return reasons[Math.floor(Math.random() * reasons.length)]
}
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 2s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
