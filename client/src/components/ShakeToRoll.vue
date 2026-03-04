<template>
  <div class="relative">
    <!-- 摇一摇提示 -->
    <div
      v-if="showHint"
      class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 animate-bounce"
    >
      <span>📱</span>
      <span>摇一摇选菜</span>
    </div>

    <!-- 摇一摇动画遮罩 -->
    <div
      v-if="isShaking"
      class="fixed inset-0 bg-black/20 z-40 flex items-center justify-center"
      @click="handleShake"
    >
      <div class="text-6xl animate-pulse">🎲</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['shake'])

const showHint = ref(true)
const isShaking = ref(false)

let shakeThreshold = 15
let lastUpdate = 0
let lastX = 0
let lastY = 0
let lastZ = 0
let shakeTimeout = null

// 处理摇一摇
const handleShake = (event) => {
  const current = event.accelerationIncludingGravity
  if (!current) return

  const currentTime = event.timestamp
  const diffTime = currentTime - lastUpdate

  if (diffTime > 100) {
    lastUpdate = currentTime

    const deltaX = Math.abs(lastX - current.x)
    const deltaY = Math.abs(lastY - current.y)
    const deltaZ = Math.abs(lastZ - current.z)

    if (deltaX + deltaY + deltaZ > shakeThreshold) {
      // 触发摇一摇
      triggerShake()
    }

    lastX = current.x
    lastY = current.y
    lastZ = current.z
  }
}

// 触发摇一摇
const triggerShake = () => {
  if (isShaking.value) return

  isShaking.value = true
  showHint.value = false

  // 振动反馈
  if (navigator.vibrate) {
    navigator.vibrate(200)
  }

  // 发出事件
  emit('shake')

  // 1秒后恢复
  setTimeout(() => {
    isShaking.value = false
  }, 1000)
}

// 请求设备运动权限 (iOS 13+)
const requestPermission = async () => {
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceMotionEvent.requestPermission()
      return permission === 'granted'
    } catch (e) {
          // 请求设备运动权限失败
      return false
    }
  }
  return true
}

// 初始化
onMounted(async () => {
  const hasPermission = await requestPermission()
  if (hasPermission) {
    window.addEventListener('devicemotion', handleShake)
  }

  // 桌面端模拟：点击触发
  shakeTimeout = setTimeout(() => {
    showHint.value = false
  }, 5000)
})

onUnmounted(() => {
  window.removeEventListener('devicemotion', handleShake)
  if (shakeTimeout) {
    clearTimeout(shakeTimeout)
  }
})

// 手动触发方法
const manualShake = () => {
  triggerShake()
}

defineExpose({
  manualShake
})
</script>
