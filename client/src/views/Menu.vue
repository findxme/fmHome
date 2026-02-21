<template>
  <div class="min-h-screen dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 transition-colors duration-300 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-4">
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">📋 菜单</h1>
      </div>
    </header>

    <!-- 分类标签 -->
    <div class="max-w-4xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
      <div class="flex gap-2">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95',
            selectedCategory === cat
              ? 'bg-accent-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
          ]"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 菜品列表 -->
    <div class="max-w-4xl mx-auto px-4 py-4 pb-24">
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin inline-block w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full"></div>
        <p class="text-gray-500 dark:text-gray-400 mt-4">加载中...</p>
      </div>

      <div v-else-if="filteredDishes.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🥗</div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">暂无菜品</h2>
        <p class="text-gray-500 dark:text-gray-400">快去添加一道吧</p>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="dish in filteredDishes"
          :key="dish.id"
          @click="$router.push(`/dish/${dish.id}`)"
          class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm active:scale-98 transition-all"
        >
          <div class="relative">
            <img
              :src="dish.image_url || '/placeholder-dish.png'"
              :alt="dish.name"
              class="w-full h-32 object-cover"
            />
            <span
              v-if="dish.isCustom"
              class="absolute top-2 left-2 text-xs px-2 py-0.5 bg-accent-500 text-white rounded-full"
            >
              自创
            </span>
          </div>
          <div class="p-3">
            <h3 class="font-semibold text-gray-800 dark:text-white truncate">{{ dish.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ dish.category }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDishStore } from '@/stores/dishes'

const store = useDishStore()
const loading = computed(() => store.loading)
const dishes = computed(() => store.dishes)

const categories = ['全部', '早餐', '午餐', '晚餐', '素菜', '汤类', '甜品', '饮品']
const selectedCategory = ref('全部')

const filteredDishes = computed(() => {
  if (selectedCategory.value === '全部') {
    return dishes.value
  }
  return dishes.value.filter(d => d.category === selectedCategory.value)
})

onMounted(() => {
  store.loadDishes()
})
</script>
