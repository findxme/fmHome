<template>
  <div class="fixed bottom-20 right-4 z-40">
    <!-- 主题按钮 -->
    <button
      @click="showPanel = !showPanel"
      class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
    >
      🎨
    </button>

    <!-- 主题面板 -->
    <transition name="slide">
      <div
        v-if="showPanel"
        class="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 w-48"
      >
        <h3 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3">选择主题</h3>

        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="theme in themes"
            :key="theme.id"
            @click="applyTheme(theme.id)"
            class="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'ring-2 ring-accent-500': currentTheme === theme.id }"
          >
            <div
              class="w-8 h-8 rounded-full"
              :style="{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }"
            ></div>
            <span class="text-xs text-gray-600 dark:text-gray-300">{{ theme.name }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { provide } from 'vue'

const showPanel = ref(false)
const currentTheme = ref('default')

const themes = [
  { id: 'default', name: '默认', primary: '#10B981', secondary: '#6366F1' },
  { id: 'summer', name: '夏日', primary: '#F59E0B', secondary: '#EC4899' },
  { id: 'autumn', name: '秋日', primary: '#EF4444', secondary: '#F97316' },
  { id: 'winter', name: '冬日', primary: '#3B82F6', secondary: '#06B6D4' },
  { id: 'romantic', name: '浪漫', primary: '#EC4899', secondary: '#8B5CF6' },
  { id: 'forest', name: '森林', primary: '#22C55E', secondary: '#14B8A6' }
]

// 应用主题
const applyTheme = (themeId) => {
  currentTheme.value = themeId
  const theme = themes.find(t => t.id === themeId)

  if (theme) {
    document.documentElement.style.setProperty('--color-primary', theme.primary)
    document.documentElement.style.setProperty('--color-secondary', theme.secondary)
    document.documentElement.style.setProperty('--color-accent-500', theme.primary)
    document.documentElement.style.setProperty('--color-accent-600', theme.primary)

  }
}

// 加载保存的主题
onMounted(() => {
  if (savedTheme && themes.find(t => t.id === savedTheme)) {
    applyTheme(savedTheme)
  }
})

provide('applyTheme', applyTheme)
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
