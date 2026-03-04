<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 transition-colors duration-300 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-4">
        <!-- 标题行 -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white">🍽️ 家庭点餐</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-0.5">今天想吃点什么？</p>
          </div>
          <div class="flex items-center gap-2">
            <!-- 搜索按钮 -->
            <button
              @click="showSearch = !showSearch"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
              title="搜索菜品"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- 家庭厨房 -->
            <button
              @click="$router.push('/family')"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
              title="家庭厨房"
            >
              <span class="text-lg">👨‍👩‍👧</span>
            </button>

            <!-- 深色模式切换 -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all active:scale-95"
              :title="isDark ? '切换亮色模式' : '切换深色模式'"
            >
              <span class="text-lg">{{ isDark ? '☀️' : '🌙' }}</span>
            </button>
          </div>
        </div>

        <!-- 快捷操作区 -->
        <div class="flex items-center justify-between gap-2 mb-4">
          <!-- AI助手 -->
          <button
            @click="$router.push('/ai-assistant')"
            class="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all text-sm font-medium"
          >
            🤖 AI
          </button>

          <!-- 掷骰子按钮 -->
          <button
            @click="rollDice"
            class="flex-1 py-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 active:scale-95 transition-all text-sm font-medium"
          >
            🎲 今天吃啥
          </button>
        </div>

      </div>
    </header>

    <!-- 搜索栏（可展开） -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showSearch" class="max-w-4xl mx-auto px-4 py-3">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索菜品、食材..."
            class="w-full px-5 py-4 pl-14 rounded-2xl bg-white dark:bg-gray-800 shadow-lg border-2 border-accent-500 dark:border-accent-600 focus:outline-none text-lg dark:text-white"
            autofocus
          />
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </transition>

    <!-- 快捷场景标签（横向滑动） -->
    <div class="max-w-4xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
      <div class="flex gap-2">
        <button
          v-for="scene in scenes"
          :key="scene.id"
          @click="selectScene(scene.id)"
          :class="[
            'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
            selectedScenes.includes(scene.id)
              ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md'
          ]"
        >
          <span>{{ scene.icon }}</span>
          <span>{{ scene.name }}</span>
        </button>
      </div>
    </div>

    <!-- 骰子结果弹窗 -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
    >
      <div v-if="showDiceResult && diceResult" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click="showDiceResult = false">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl" @click.stop>
          <div class="text-6xl mb-4 animate-bounce">{{ diceResult.emoji || '🍽️' }}</div>
          <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">{{ diceResult.name }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">{{ diceResult.description }}</p>
          <div class="flex gap-3">
            <button @click="addToCart(diceResult)" class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-medium hover:bg-accent-600 active:scale-95 transition-all">
              🛒 加入菜单
            </button>
            <button @click="viewDish(diceResult)" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium active:scale-95 transition-all">
              查看做法
            </button>
          </div>
          <button @click="showDiceResult = false" class="mt-4 text-gray-400 text-sm">关闭</button>
        </div>
      </div>
    </transition>

    <!-- 加载中 -->
    <div v-if="loading" class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="text-4xl mb-4 animate-bounce">🍽️</div>
          <p class="text-gray-500 dark:text-gray-400">正在加载菜品...</p>
        </div>
      </div>
    </div>

    <!-- 菜品列表 -->
    <div v-else class="max-w-4xl mx-auto px-4 py-6">
      <!-- 结果统计 -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ sceneLabel }}
        </h2>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ filteredDishes.length }} 道菜</span>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredDishes.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">没有找到菜品</h3>
        <p class="text-gray-500 dark:text-gray-400">试试其他筛选条件吧</p>
      </div>

      <!-- 瀑布流卡片 -->
      <div v-else class="columns-2 md:columns-3 gap-4 space-y-4">
        <DishCard
          v-for="dish in filteredDishes"
          :key="dish.id"
          :dish="dish"
          class="break-inside-avoid mb-4"
          @click="viewDish(dish)"
          @add-to-cart="handleAddToCart(dish)"
        />
      </div>
    </div>

    <!-- Toast 提示 -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-8"
    >
      <div v-if="toast.show" class="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
        <div class="flex items-center gap-2 px-4 py-3 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-full shadow-lg">
          <span>{{ toast.icon }}</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDishStore } from '@/stores/dishes'
import DishCard from '@/components/DishCard.vue'

const router = useRouter()
const dishStore = useDishStore()

// 深色模式
const isDark = inject('isDark')
const toggleDark = inject('toggleDark')

const toggleTheme = () => {
  if (toggleDark) {
    toggleDark()
  } else {
    isDark.value = !isDark.value
    
  }
}

// 搜索
const searchQuery = ref('')
const showSearch = ref(false)

// 快捷场景
const scenes = [
  { id: 'all', name: '全部', icon: '📋' },
  { id: '早餐', name: '早餐', icon: '🍳' },
  { id: '午餐', name: '午餐', icon: '🍱' },
  { id: '晚餐', name: '晚餐', icon: '🍲' },
  { id: '素菜', name: '素菜', icon: '🥗' },
  { id: '汤类', name: '汤类', icon: '🍜' },
  { id: '甜品', name: '甜品', icon: '🍰' },
]

// 支持多选
const selectedScenes = ref([])

// 从 localStorage 恢复保存的场景选择
onMounted(() => {
  selectedScenes.value = []
})

// 兼容旧的 single 选择器
const selectedScene = computed({
  get: () => selectedScenes.value.length > 0 ? selectedScenes.value[0] : 'all',
  set: (val) => {
    if (val === 'all') {
      selectedScenes.value = []
    } else {
      selectedScenes.value = [val]
    }
  }
})

const selectScene = (id) => {
  if (id === 'all') {
    selectedScenes.value = []
  } else {
    // 多选逻辑：点击已选中则取消，否则添加
    const index = selectedScenes.value.indexOf(id)
    if (index > -1) {
      selectedScenes.value.splice(index, 1)
    } else {
      selectedScenes.value.push(id)
    }
  }
  // 收起搜索框
  showSearch.value = false
}

const sceneLabel = computed(() => {
  if (selectedScenes.value.length === 0) {
    return '全部菜品'
  }
  const selectedNames = scenes
    .filter(s => selectedScenes.value.includes(s.id))
    .map(s => s.name)
    .join(' + ')
  return selectedNames
})

// 筛选逻辑 - 支持多条件组合筛选
const filteredDishes = computed(() => {
  let dishes = dishStore.dishes || []

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    dishes = dishes.filter(d =>
      d.name?.toLowerCase().includes(query) ||
      d.tags?.toLowerCase().includes(query)
    )
  }

  // 多条件组合筛选（分类）
  if (selectedScenes.value.length > 0) {
    dishes = dishes.filter(d => selectedScenes.value.includes(d.category))
  }

  return dishes
})

const loading = computed(() => dishStore.loading)

// 掷骰子
const showDiceResult = ref(false)
const diceResult = ref(null)

const rollDice = () => {
  const dishes = filteredDishes.value
  if (dishes.length === 0) {
    showToast('🍽️', '还没有菜品')
    return
  }
  const randomIndex = Math.floor(Math.random() * dishes.length)
  diceResult.value = dishes[randomIndex]
  showDiceResult.value = true
}

// Toast
const toast = ref({ show: false, message: '', icon: '' })
const showToast = (icon, message) => {
  toast.value = { show: true, icon, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

// 加入购物车
const handleAddToCart = (dish) => {
  dishStore.addToCart(dish)
  showToast('🛒', `已加入菜单：${dish.name}`)
}

const addToCart = (dish) => {
  dishStore.addToCart(dish)
}

const viewDish = (dish) => {
  router.push(`/dish/${dish.id}`)
}

onMounted(() => {
  dishStore.loadDishes()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
