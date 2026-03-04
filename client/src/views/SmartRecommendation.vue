<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部 -->
    <div class="bg-gradient-to-r from-accent-500 to-accent-600 text-white p-6 pt-12">
      <h1 class="text-2xl font-bold mb-2">AI 智能推荐</h1>
      <p class="text-accent-100">根据你的心情和口味推荐菜品</p>
    </div>

    <!-- 心情选择 -->
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">今天心情怎么样？</h2>
      <div class="grid grid-cols-5 gap-3">
        <button
          v-for="mood in moodOptions"
          :key="mood.id"
          @click="selectMood(mood)"
          class="flex flex-col items-center p-3 rounded-2xl transition-all"
          :class="selectedMood?.id === mood.id
            ? 'bg-accent-100 dark:bg-accent-900/30 ring-2 ring-accent-500'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'"
        >
          <span class="text-3xl mb-1">{{ mood.icon }}</span>
          <span class="text-xs text-gray-600 dark:text-gray-300">{{ mood.name }}</span>
        </button>
      </div>
    </div>

    <!-- 推荐结果 -->
    <div v-if="recommendations.length > 0" class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {{ selectedMood?.name }}的时候，推荐吃这个~
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ reason }}</p>

      <div class="space-y-3">
        <div
          v-for="dish in recommendations"
          :key="dish.id"
          @click="goToDish(dish.id)"
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-center gap-4"
        >
          <img
            :src="dish.image_url || '/placeholder-food.jpg'"
            :alt="dish.name"
            class="w-20 h-20 rounded-xl object-cover"
          />
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ dish.name }}</h3>
            <p class="text-sm text-gray-500">{{ dish.category }} · {{ dish.difficulty }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ dish.cooking_time }}</p>
          </div>
          <span class="text-2xl">👉</span>
        </div>
      </div>
    </div>

    <!-- 随机推荐 -->
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">纠结？那就随机吧！</h2>
      <button
        @click="rollDice"
        :disabled="isRolling"
        class="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
      >
        <span v-if="isRolling">🎲 选中中...</span>
        <span v-else>🎲 随机选菜</span>
      </button>

      <div v-if="randomResult" class="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <div class="text-center">
          <p class="text-4xl mb-2">{{ randomResult.dish?.icon || '🍽️' }}</p>
          <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ randomResult.dish?.name }}</h3>
          <p class="text-sm text-gray-500 mt-2">{{ randomResult.reason }}</p>
          <button
            @click="goToDish(randomResult.dish?.id)"
            class="mt-3 px-6 py-2 bg-accent-500 text-white rounded-full text-sm"
          >
            查看做法
          </button>
        </div>
      </div>
    </div>

    <!-- 季节推荐 -->
    <div class="p-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">🍂 季节推荐</h2>
      <div v-if="seasonal" class="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">{{ seasonal.reason }}</p>
        <div class="flex gap-2 overflow-x-auto pb-2">
          <div
            v-for="dish in seasonal.recommendations"
            :key="dish.id"
            @click="goToDish(dish.id)"
            class="flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm w-28"
          >
            <img
              :src="dish.image_url || '/placeholder-food.jpg'"
              class="w-full h-16 rounded-lg object-cover mb-2"
            />
            <p class="text-xs text-gray-700 dark:text-gray-300 truncate">{{ dish.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * SmartRecommendation.vue - AI 智能推荐页面
 * 
 * 功能说明：
 * 1. 心情推荐：根据用户当前心情推荐合适的菜品
 * 2. 随机选菜：纠结时使用随机推荐功能
 * 3. 季节推荐：根据当前季节推荐应季菜品
 * 
 * 依赖：
 * - aiApi: AI 推荐接口
 * - vue-router: 路由跳转
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { aiApi } from '@/api'

const router = useRouter()

// 心情选项列表
const moodOptions = ref([])
// 当前选中的心情
const selectedMood = ref(null)
// 推荐菜品列表
const recommendations = ref([])
// 推荐理由
const reason = ref('')
// 随机推荐加载状态
const isRolling = ref(false)
// 随机推荐结果
const randomResult = ref(null)
// 季节推荐数据
const seasonal = ref(null)

// 页面加载时获取心情选项和季节推荐
onMounted(async () => {
  // 获取心情选项
  try {
    const res = await aiApi.getMoodOptions()
    if (res.data.success) {
      moodOptions.value = res.data.data
    }
  } catch (e) {
        // 错误处理
  }

  // 获取季节推荐
  try {
    const res = await aiApi.getSeasonal()
    if (res.data.success) {
      seasonal.value = res.data.data
    }
  } catch (e) {
        // 错误处理
  }
})

/**
 * 选择心情并获取推荐
 * @param {Object} mood - 心情对象，包含 id, name, icon 等属性
 */
const selectMood = async (mood) => {
  selectedMood.value = mood

  try {
    const res = await aiApi.recommendByMood({ mood: mood.name })
    if (res.data.success) {
      recommendations.value = res.data.data.recommendations || []
      reason.value = res.data.data.reason
    }
  } catch (e) {
        // 错误处理
  }
}

/**
 * 随机选菜功能
 * 用于帮助用户解决"今天吃什么"的难题
 */
const rollDice = async () => {
  isRolling.value = true

  try {
    const res = await aiApi.rollDice()
    if (res.data.success) {
      randomResult.value = res.data.data
    }
  } catch (e) {
        // 错误处理
  }

  isRolling.value = false
}

/**
 * 跳转到菜品详情页
 * @param {string|number} id - 菜品ID
 */
const goToDish = (id) => {
  if (id) {
    router.push(`/dish/${id}`)
  }
}
</script>
