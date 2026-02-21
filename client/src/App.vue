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
import { ref, onMounted } from 'vue'
import BottomNav from '@/components/BottomNav.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'

const isDark = ref(false)

// 从localStorage读取用户偏好
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 跟随系统设置
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches
  }
})

// 切换深色模式
const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
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
