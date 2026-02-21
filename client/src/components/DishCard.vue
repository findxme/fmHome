<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-98"
    @click="$emit('click')"
  >
    <!-- 图片区域 -->
    <div class="relative">
      <img
        :src="dish.images?.[0] || dish.image_url || '/placeholder-dish.png'"
        :alt="dish.name"
        class="w-full h-48 object-cover"
        @error="handleImageError"
        loading="lazy"
      />
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

      <!-- 收藏按钮 -->
      <button
        @click.stop="toggleFavorite"
        class="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
        :class="{ 'text-red-500': isFavorite, 'text-gray-400': !isFavorite }"
      >
        <svg class="w-5 h-5" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <!-- 时间标签 -->
      <div class="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
        <span>⏱️</span>
        <span>{{ dish.cooking_time || '30分钟' }}</span>
      </div>

      <!-- 难度标签 -->
      <div class="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs">
        <span>{{ difficultyIcon }}</span>
        <span>{{ dish.difficulty || '中等' }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-4">
      <!-- 标签行 -->
      <div class="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide">
        <span
          class="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="getCategoryClass(dish.category)"
        >
          {{ dish.category || '家常菜' }}
        </span>
        <span
          v-if="dish.servings"
          class="flex-shrink-0 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
        >
          👤 {{ dish.servings }}
        </span>
      </div>

      <!-- 标题 -->
      <h3 class="font-semibold text-lg text-gray-800 dark:text-white mb-1 line-clamp-1">{{ dish.name }}</h3>

      <!-- 描述 -->
      <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{{ dish.description || '一道美味的家常菜' }}</p>

      <!-- 底部行 -->
      <div class="flex items-center justify-between">
        <!-- 评分 -->
        <div class="flex items-center gap-1">
          <span class="text-yellow-500">⭐</span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ dish.rating || '4.8' }}</span>
        </div>

        <!-- 操作按钮 -->
        <button
          @click.stop="addToCart"
          class="flex items-center gap-1 px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white rounded-full text-sm font-medium active:scale-90 transition-all"
        >
          <span>🛒</span>
          <span>加菜单</span>
        </button>
      </div>
    </div>

    <!-- 收藏动画 -->
    <transition
      enter-active-class="animate-heart-burst"
      leave-active-class="animate-heart-burst"
    >
      <div v-if="showHeartAnimation" class="absolute inset-0 pointer-events-none flex items-center justify-center">
        <span class="text-4xl animate-ping">❤️</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDishStore } from '@/stores/dishes'

const props = defineProps({
  dish: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click', 'add-to-cart'])
const dishStore = useDishStore()

// 收藏状态
const isFavorite = ref(false)
const showHeartAnimation = ref(false)

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  if (isFavorite.value) {
    showHeartAnimation.value = true
    setTimeout(() => {
      showHeartAnimation.value = false
    }, 500)
  }
}

// 难度图标
const difficultyIcon = computed(() => {
  const icons = {
    '简单': '🔥',
    '中等': '💪',
    '困难': '🏆'
  }
  return icons[props.dish.difficulty] || '💪'
})

const addToCart = () => {
  emit('add-to-cart')
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300?text=美食图片'
}

const getCategoryClass = (category) => {
  const classes = {
    '午餐': 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400',
    '晚餐': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    '早餐': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    '汤类': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    '小食': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    '素菜': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    '主食': 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    '甜品': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
  }
  return classes[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}
</script>

<style scoped>
.active\:scale-98:active {
  transform: scale(0.98);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes heart-burst {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
}

.animate-heart-burst {
  animation: heart-burst 0.5s ease-out;
}
</style>
