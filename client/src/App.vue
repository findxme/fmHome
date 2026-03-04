<template>
  <div id="app" :class="{ 'dark': isDark }" class="min-h-screen transition-colors duration-300">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <router-view v-slot="{ Component }">
        <keep-alive include="Home">
          <component :is="Component" />
        </keep-alive>
      </router-view>

      <!-- 底部导航 -->
      <BottomNav />

      <!-- 主题选择器 -->
      <ThemeSelector />
    </div>
  </div>
</template>

<script setup>
// 码匠 (Code Smith) - 全栈开发 AI 工程师，负责代码开发与实现
import { ref, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { useDishStore } from '@/stores/dishes'

const isDark = ref(false)
const store = useDishStore()

onMounted(() => {
  // 优先从 localStorage 读取保存的主题设置
  const savedTheme = localStorage.getItem('theme-dark')
  if (savedTheme !== null) {
    isDark.value = savedTheme === 'true'
  } else {
    // 如果没有保存，则跟随系统设置
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  // 加载购物车
  store.loadCart()
})

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  isDark.value = e.matches
})

// 切换深色模式
const toggleDark = () => {
  isDark.value = !isDark.value
  // 保存到 localStorage
  localStorage.setItem('theme-dark', isDark.value.toString())
}

// 暴露给子组件
import { provide } from 'vue'
provide('isDark', isDark)
provide('toggleDark', toggleDark)
</script>

<style>
/* 全局样式 */
html {
  scroll-behavior: smooth;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark ::-webkit-scrollbar-thumb {
  background: #475569;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* 安全区域适配 */
@supports (padding: env(safe-area-inset-bottom)) {
  .pb-safe {
    padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
}
</style>
