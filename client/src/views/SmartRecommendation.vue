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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { aiApi } from '@/api'

const router = useRouter()

const moodOptions = ref([])
const selectedMood = ref(null)
const recommendations = ref([])
const reason = ref('')
const isRolling = ref(false)
const randomResult = ref(null)
const seasonal = ref(null)

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

const goToDish = (id) => {
  if (id) {
    router.push(`/dish/${id}`)
  }
}
</script>
