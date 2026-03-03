<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 transition-colors duration-300 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-4 flex items-center gap-4">
        <button @click="$router.back()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
          <svg class="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold text-gray-800 dark:text-white truncate">{{ dish?.name || '菜品详情' }}</h1>

        <!-- 操作按钮：收藏/编辑/删除 -->
        <div class="ml-auto flex items-center gap-2">
          <!-- 示例/自定义菜品：编辑和删除 -->
          <template v-if="isEditable">
            <button
              @click="editDish"
              class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteDish"
              class="p-2 rounded-full bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </template>
          <!-- 普通菜品：收藏 -->
          <button
            v-else
            @click="toggleFavorite"
            class="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" :class="isFavorite ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 骨架屏加载 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-6">
      <div class="animate-pulse space-y-4">
        <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>

    <!-- 菜品详情 -->
    <div v-else-if="dish" class="max-w-4xl mx-auto px-4 py-6 pb-24">
      <!-- 菜品图片/视频 -->
      <div class="relative rounded-2xl overflow-hidden mb-6">
        <!-- 视频展示 -->
        <div v-if="dish.video" class="relative">
          <video
            :src="dish.video"
            controls
            class="w-full h-64 object-cover"
          >
            您的浏览器不支持视频播放
          </video>
          <div class="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
            🎬 视频
          </div>
        </div>

        <!-- 多图轮播 -->
        <div v-else-if="dish.images && dish.images.length > 1" class="relative">
          <img
            :src="dish.images[currentImageIndex] || '/placeholder-dish.png'"
            :alt="dish.name"
            class="w-full h-64 object-cover"
          />
          <!-- 轮播指示器 -->
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <button
              v-for="(img, index) in dish.images"
              :key="index"
              @click="currentImageIndex = index"
              class="w-2 h-2 rounded-full transition-all"
              :class="index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'"
            ></button>
          </div>
          <!-- 左右切换按钮 -->
          <button
            v-if="dish.images.length > 1"
            @click="prevImage"
            class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            ‹
          </button>
          <button
            v-if="dish.images.length > 1"
            @click="nextImage"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center"
          >
            ›
          </button>
        </div>

        <!-- 单图 -->
        <img
          v-else
          :src="dish.image_url || '/placeholder-dish.png'"
          :alt="dish.name"
          class="w-full h-64 object-cover"
        />

        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div class="flex flex-wrap gap-2 text-white">
            <span class="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm">
              {{ dish.difficulty }}
            </span>
            <span class="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm">
              {{ dish.cooking_time }}
            </span>
            <span class="px-3 py-1 rounded-full text-sm bg-white/20 backdrop-blur-sm">
              👤 {{ dish.servings }}
            </span>
          </div>
        </div>
      </div>

      <!-- 基本信息卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4 transition-colors duration-300">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">{{ dish.name }}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ dish.description }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in (dish.tags || '').split(',')"
            :key="tag"
            class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 食材清单卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4 transition-colors duration-300">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="text-lg">🛒</span> 食材清单
        </h3>

        <!-- 主料 -->
        <div v-if="mainIngredients.length" class="mb-4">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">🥩 主料</h4>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="ing in mainIngredients"
              :key="ing.name"
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <input
                type="checkbox"
                v-model="checkedIngredients[ing.name]"
                class="w-5 h-5 rounded text-primary-500"
              />
              <span :class="{ 'line-through text-gray-400': checkedIngredients[ing.name] }" class="text-gray-800 dark:text-white flex-1">
                {{ ing.name }}
              </span>
              <span class="text-gray-500 text-sm">{{ ing.amount }}</span>
            </div>
          </div>
        </div>

        <!-- 调料 -->
        <div v-if="seasoningIngredients.length" class="mb-4">
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">🧂 调料</h4>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="ing in seasoningIngredients"
              :key="ing.name"
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <input
                type="checkbox"
                v-model="checkedIngredients[ing.name]"
                class="w-5 h-5 rounded text-primary-500"
              />
              <span :class="{ 'line-through text-gray-400': checkedIngredients[ing.name] }" class="text-gray-800 dark:text-white flex-1">
                {{ ing.name }}
              </span>
              <span class="text-gray-500 text-sm">{{ ing.amount }}</span>
            </div>
          </div>
        </div>

        <!-- 提示 -->
        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p class="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span>💡</span>
            <span>勾选已准备的食材，方便购物时查漏补缺</span>
          </p>
        </div>
      </div>

      <!-- 小贴士 -->
      <div v-if="dish.tips && dish.tips.length" class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 mb-4 transition-colors duration-300">
        <h3 class="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2">
          <span class="text-lg">⭐</span> 烹饪小贴士
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(tip, index) in dish.tips"
            :key="index"
            class="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"
          >
            <span class="text-amber-500 mt-1">•</span>
            {{ tip }}
          </li>
        </ul>
      </div>

      <!-- 制作步骤 -->
      <div class="mb-4">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="text-lg">📝</span> 制作步骤
        </h3>
        <StepCard
          v-for="(step, index) in dish.steps"
          :key="index"
          :step="step"
          :index="index"
        />
      </div>

      <!-- 相关视频 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4 transition-colors duration-300">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span class="text-lg">🎬</span> 视频教程
        </h3>

        <!-- 加载状态 -->
        <div v-if="loadingVideos" class="text-center py-6">
          <div class="animate-spin inline-block w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full"></div>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">正在搜索...</p>
        </div>

        <!-- 无视频时显示备用链接 -->
        <div v-else-if="videos.length === 0" class="space-y-3">
          <p class="text-gray-500 dark:text-gray-400 text-center mb-4">暂无相关视频，来看看这些推荐吧</p>

          <!-- B站搜索链接 -->
          <a
            :href="`https://search.bilibili.com/video?keyword=${encodeURIComponent(dish.name + ' 做法')}`"
            target="_blank"
            class="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors"
          >
            <span class="text-2xl">📺</span>
            <div class="flex-1">
              <p class="font-medium text-pink-700 dark:text-pink-300">B站教程</p>
              <p class="text-sm text-pink-500 dark:text-pink-400">搜索「{{ dish.name }}做法」</p>
            </div>
            <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <!-- 小红书搜索链接 -->
          <a
            :href="`https://www.xiaohongshu.com/search/${encodeURIComponent(dish.name)}`"
            target="_blank"
            class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <span class="text-2xl">📕</span>
            <div class="flex-1">
              <p class="font-medium text-red-700 dark:text-red-300">小红书食谱</p>
              <p class="text-sm text-red-500 dark:text-red-400">查看超多 {{ dish.name }} 食谱</p>
            </div>
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <!-- 抖音搜索链接 -->
          <a
            :href="`https://www.douyin.com/search/${encodeURIComponent(dish.name)}`"
            target="_blank"
            class="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span class="text-2xl">🎵</span>
            <div class="flex-1">
              <p class="font-medium text-gray-700 dark:text-gray-300">抖音教程</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">短视频教程学做菜</p>
            </div>
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- 有视频时显示 -->
        <div v-else class="grid grid-cols-2 gap-3">
          <a
            v-for="video in videos"
            :key="video.url"
            :href="video.url"
            target="_blank"
            class="block bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden hover:shadow-md transition-all active:scale-98"
          >
            <div class="relative">
              <img :src="video.pic" :alt="video.title" class="w-full h-24 object-cover" />
              <span class="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 rounded">
                {{ video.duration }}
              </span>
            </div>
            <div class="p-2">
              <p class="text-sm text-gray-800 dark:text-white line-clamp-2">{{ video.title }}</p>
            </div>
          </a>

          <!-- 额外显示小红书链接 -->
          <a
            :href="`https://www.xiaohongshu.com/search/${encodeURIComponent(dish.name)}`"
            target="_blank"
            class="block bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-xl overflow-hidden p-3 active:scale-98"
          >
            <div class="flex flex-col items-center justify-center h-full py-2">
              <span class="text-3xl mb-1">📕</span>
              <p class="text-sm font-medium text-red-700 dark:text-red-300">小红书食谱</p>
              <p class="text-xs text-red-500 dark:text-red-400 mt-1">更多做法</p>
            </div>
          </a>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-700 p-4 z-30">
        <div class="max-w-4xl mx-auto flex gap-3">
          <button
            @click="addToCart"
            :disabled="inCart"
            class="flex-1 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ inCart ? '已加入菜单' : '加入菜单' }}
          </button>
          <button
            @click="goToCart"
            class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium active:scale-95 transition-all"
          >
            查看菜单 ({{ cartCount }})
          </button>
        </div>
      </div>

      <!-- 底部安全区域 -->
      <div class="h-safe"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dishApi, videoApi } from '@/api'
import { useDishStore } from '@/stores/dishes'
import StepCard from '@/components/StepCard.vue'

const route = useRoute()
const router = useRouter()
const dishStore = useDishStore()

const loading = ref(true)
const dish = ref(null)
const videos = ref([])
const loadingVideos = ref(false)
const checkedIngredients = reactive({})
const isFavorite = ref(false)
const currentImageIndex = ref(0)

// 图片轮播
const prevImage = () => {
  if (dish.value?.images) {
    currentImageIndex.value = currentImageIndex.value === 0
      ? dish.value.images.length - 1
      : currentImageIndex.value - 1
  }
}

const nextImage = () => {
  if (dish.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % dish.value.images.length
  }
}

// 分类食材
const mainIngredients = computed(() => {
  if (!dish.value?.ingredients) return []
  return dish.value.ingredients.filter(ing => ing.category === '主料')
})

const seasoningIngredients = computed(() => {
  if (!dish.value?.ingredients) return []
  return dish.value.ingredients.filter(ing =>
    ['调料', '香料'].includes(ing.category)
  )
})

const inCart = computed(() => {
  return dishStore.cart.some(item => item.id === dish.value?.id)
})

const cartCount = computed(() => {
  return dishStore.cart.reduce((sum, item) => sum + item.quantity, 0)
})

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

// 判断是否是自定义/示例菜品（可编辑）
const isEditable = computed(() => {
  return dish.value?.isCustom || dish.value?.isSample || dish.value?.id?.startsWith('custom_') || dish.value?.id?.startsWith('sample_')
})

// 判断是否是自定义菜品（仅用于显示）
const isCustomDish = computed(() => {
  return dish.value?.isCustom || dish.value?.id?.startsWith('custom_')
})

// 编辑菜品
const editDish = () => {
  // 将菜品数据传递到编辑页面
  router.push({
    path: '/add-dish',
    query: { edit: dish.value.id, data: JSON.stringify(dish.value) }
  })
}

// 删除自定义菜品
const deleteDish = async () => {
  if (confirm('确定要删除这个菜品吗？')) {
    if (dish.value?.id) {
      await dishStore.deleteCustomDish(dish.value.id)
      showToast('🗑️', '菜品已删除')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }
}

// Toast
const toast = ref({ show: false, message: '', icon: '' })
const showToast = (icon, message) => {
  toast.value = { show: true, icon, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const addToCart = () => {
  if (dish.value) {
    dishStore.addToCart(dish.value)
  }
}

const goToCart = () => {
  router.push('/cart')
}

const loadDish = async () => {
  loading.value = true
  const dishId = route.params.id

  // 确保 store 已加载菜品
  if (dishStore.dishes.length === 0) {
    await dishStore.loadDishes()
  }

  // 从 store 中查找菜品
  const foundDish = dishStore.dishes.find(d => d.id === dishId)

  if (foundDish) {
    dish.value = foundDish
    initIngredients()
  } else {
    // 从 API 加载
    try {
      const res = await dishApi.getById(dishId)
      dish.value = res.data.data
      if (dish.value) {
        initIngredients()
      }
    } catch (e) {
      console.error('加载菜品失败:', e)
    }
  }

  loading.value = false
}

// 初始化食材勾选状态
const initIngredients = () => {
  if (dish.value?.ingredients && Array.isArray(dish.value.ingredients)) {
    dish.value.ingredients.forEach(ing => {
      const name = typeof ing === 'string' ? ing : (ing.name || '')
      if (name) {
        checkedIngredients[name] = false
      }
    })
  }
}

onMounted(() => {
  loadDish()
})
</script>

<style scoped>
.h-safe {
  height: env(safe-area-inset-bottom);
}
</style>
