<template>
  <div v-if="show" class="fixed inset-0 pointer-events-none z-50" ref="confettiContainer"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import confetti from 'canvas-confetti'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'default' // default, firework, stars
  }
})

const confettiContainer = ref(null)

// 默认庆祝动效
const celebrate = () => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#F97316', '#EC4899']

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors
  })
}

// 烟花动效
const firework = () => {
  const duration = 3 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

  const randomInRange = (min, max) => Math.random() * (max - min) + min

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)

    confetti({
      ...defaults,
      particleCount,
      origin: {
        x: randomInRange(0.1, 0.3),
        y: Math.random() - 0.2
      }
    })
    confetti({
      ...defaults,
      particleCount,
      origin: {
        x: randomInRange(0.7, 0.9),
        y: Math.random() - 0.2
      }
    })
  }, 250)
}

// 星星动效
const stars = () => {
  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['#FFE400', '#FFBD00', '#FF9A00', '#FF6B00']
  }

  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ['star'],
    origin: { y: 0.6 }
  })

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ['circle'],
    origin: { y: 0.6 }
  })
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    // 播放设备振动（如果支持）
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }

    // 根据类型播放不同动效
    switch (props.type) {
      case 'firework':
        firework()
        break
      case 'stars':
        stars()
        break
      default:
        celebrate()
    }
  }
})

// 暴露方法供外部调用
defineExpose({
  celebrate: () => {
    if (props.type === 'firework') {
      firework()
    } else if (props.type === 'stars') {
      stars()
    } else {
      celebrate()
    }
  }
})
</script>
