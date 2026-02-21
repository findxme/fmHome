<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-r from-accent-500 to-accent-600 text-white sticky top-0 z-30 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h1 class="text-xl font-bold">欢迎使用</h1>
            <p class="text-white/80 text-sm">家庭点餐系统</p>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <!-- 快捷功能 -->
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="$router.push('/add-dish')"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left active:scale-98 transition-all"
        >
          <div class="text-3xl mb-2">➕</div>
          <h3 class="font-medium text-gray-800 dark:text-white">添加菜品</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">分享你的拿手菜</p>
        </button>

        <button
          @click="$router.push('/family')"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left active:scale-98 transition-all"
        >
          <div class="text-3xl mb-2">👨‍👩‍👧</div>
          <h3 class="font-medium text-gray-800 dark:text-white">家庭厨房</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">管理家庭成员</p>
        </button>
      </div>

      <!-- 收藏的菜品 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>❤️</span> 收藏的菜品
        </h2>

        <div v-if="favorites.length === 0" class="text-center py-6">
          <div class="text-4xl mb-2">💔</div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">还没有收藏的菜品</p>
          <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">去点餐页面收藏喜欢的菜品吧</p>
        </div>

        <div v-else class="grid grid-cols-2 gap-3">
          <div
            v-for="dish in favorites"
            :key="dish.id"
            @click="$router.push(`/dish/${dish.id}`)"
            class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 active:scale-95 transition-all"
          >
            <img
              :src="dish.image_url || '/placeholder-dish.png'"
              :alt="dish.name"
              class="w-full h-20 object-cover rounded-lg mb-2"
            />
            <p class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ dish.name }}</p>
          </div>
        </div>
      </div>

      <!-- 浏览历史 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>📜</span> 浏览历史
        </h2>

        <div v-if="history.length === 0" class="text-center py-6">
          <div class="text-4xl mb-2">📝</div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">还没有浏览记录</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="dish in history"
            :key="dish.id"
            @click="$router.push(`/dish/${dish.id}`)"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
          >
            <img
              :src="dish.image_url || '/placeholder-dish.png'"
              :alt="dish.name"
              class="w-12 h-12 object-cover rounded-lg"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-800 dark:text-white">{{ dish.name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ dish.category }} · {{ dish.difficulty }}</p>
            </div>
          </div>
        </div>

        <button
          v-if="history.length > 0"
          @click="clearHistory"
          class="mt-4 w-full py-2 text-red-500 text-sm hover:text-red-600"
        >
          清空历史记录
        </button>
      </div>

      <!-- 设置入口 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>⚙️</span> 设置
        </h2>

        <div class="space-y-2">
          <button
            @click="toggleTheme"
            class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-gray-800 dark:text-white">{{ isDark ? '切换亮色模式' : '切换深色模式' }}</span>
            <span class="text-2xl">{{ isDark ? '☀️' : '🌙' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 收藏的菜品
const favorites = ref([])

// 浏览历史
const history = ref([])

// 主题
const isDark = ref(false)

onMounted(() => {
  // 加载收藏
  const savedFavorites = localStorage.getItem('fmhome_favorites')
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }

  // 加载历史
  const savedHistory = localStorage.getItem('fmhome_history')
  if (savedHistory) {
    history.value = JSON.parse(savedHistory).slice(0, 10)
  }

  // 加载主题
  const savedTheme = localStorage.getItem('fmhome_theme')
  isDark.value = savedTheme === 'dark'
})

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('fmhome_theme', isDark.value ? 'dark' : 'light')

  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 清空历史
const clearHistory = () => {
  if (confirm('确定清空浏览历史吗？')) {
    history.value = []
    localStorage.removeItem('fmhome_history')
  }
}
</script>
