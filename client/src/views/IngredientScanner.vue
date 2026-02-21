<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部 -->
    <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 pt-12">
      <button @click="$router.back()" class="mb-4">← 返回</button>
      <h1 class="text-2xl font-bold mb-2">🥗 食材识别</h1>
      <p class="text-green-100">输入家里有的食材，AI帮你推荐菜谱</p>
    </div>

    <div class="p-4">
      <!-- 手动输入 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-3">添加食材</h2>
        <div class="flex gap-2 mb-3">
          <input
            v-model="manualIngredient"
            type="text"
            placeholder="输入食材名称，如：鸡蛋、番茄"
            class="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-0 dark:text-white"
            @keyup.enter="addIngredient"
          />
          <button
            @click="addIngredient"
            class="px-6 py-3 bg-green-500 text-white rounded-xl font-medium"
          >
            添加
          </button>
        </div>

        <!-- 已添加食材 -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="ing in ingredients"
            :key="ing"
            class="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1"
          >
            {{ ing }}
            <button @click="removeIngredient(ing)" class="ml-1">×</button>
          </span>
        </div>
      </div>

      <!-- 推荐按钮 -->
      <button
        v-if="ingredients.length > 0"
        @click="getRecommendations"
        :disabled="isLoading"
        class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        {{ isLoading ? '🤔 AI推荐中...' : '🚀 根据食材推荐菜谱' }}
      </button>

      <!-- 推荐结果 -->
      <div v-if="recommendations.length > 0" class="mt-4">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-3">为你推荐</h2>
        <div class="space-y-3">
          <div
            v-for="recipe in recommendations"
            :key="recipe.name"
            class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">{{ recipe.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ recipe.description }}</p>
            <div class="flex gap-2 text-xs text-gray-400">
              <span>⏱️ {{ recipe.time || '30分钟' }}</span>
              <span>📊 {{ recipe.difficulty || '中等' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 常用食材快捷添加 -->
      <div class="mt-6">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">常用食材</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="item in quickIngredients"
            :key="item"
            @click="addQuickIngredient(item)"
            class="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
          >
            + {{ item }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { aiApi } from '@/api'

const manualIngredient = ref('')
const ingredients = ref([])
const recommendations = ref([])
const isLoading = ref(false)

const quickIngredients = [
  '鸡蛋', '番茄', '土豆', '鸡胸肉', '五花肉', '米饭', '面条',
  '胡萝卜', '洋葱', '青椒', '豆腐', '虾', '鱼'
]

const addIngredient = () => {
  if (!manualIngredient.value.trim()) return
  if (!ingredients.value.includes(manualIngredient.value.trim())) {
    ingredients.value.push(manualIngredient.value.trim())
  }
  manualIngredient.value = ''
}

const addQuickIngredient = (item) => {
  if (!ingredients.value.includes(item)) {
    ingredients.value.push(item)
  }
}

const removeIngredient = (item) => {
  ingredients.value = ingredients.value.filter(i => i !== item)
}

const getRecommendations = async () => {
  if (ingredients.value.length === 0) return

  isLoading.value = true
  try {
    const res = await aiApi.ingredientRecipe({
      ingredients: ingredients.value
    })

    if (res.data.success && res.data.data?.recipes) {
      recommendations.value = res.data.data.recipes
    }
  } catch (e) {
    console.error('获取推荐失败:', e)
  }
  isLoading.value = false
}
</script>
