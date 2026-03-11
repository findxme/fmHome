<template>
  <div class="fixed bottom-0 left-0 right-0 z-40 pb-safe">
    <!-- 导航栏背景 -->
    <div class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-lg border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div class="max-w-4xl mx-auto">
        <!-- 主导航 -->
        <div class="flex items-center h-16 px-2">
          <button
            v-for="item in navItems"
            :key="item.route"
            @click="navigate(item.route)"
            class="flex flex-col items-center justify-center flex-1 h-full transition-all relative py-2 px-2"
            :class="[
              isActive(item.route)
                ? 'text-accent-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            ]"
          >
            <!-- 图标 -->
            <div
              class="relative flex items-center justify-center w-7 h-7 rounded-full transition-all"
              :class="[
                isActive(item.route)
                  ? 'bg-accent-100 dark:bg-accent-900/30 transform -translate-y-1'
                  : 'bg-transparent'
              ]"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <!-- 角标 -->
              <span
                v-if="item.badge && cartCount > 0"
                class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </div>
            <!-- 文字 -->
            <span class="text-xs font-medium mt-0.5">{{ item.name }}</span>

            <!-- 选中指示器 -->
            <div
              v-if="isActive(item.route)"
              class="absolute bottom-0 w-8 h-1 bg-accent-500 rounded-t-full"
            ></div>
          </button>
        </div>

      </div>
    </div>

    <!-- 底部安全区域（适配全面屏） -->
    <div class="h-safe"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDishStore } from '@/stores/dishes'

const router = useRouter()
const route = useRoute()
const dishStore = useDishStore()

// 购物车数量
const cartCount = computed(() => dishStore.cart.length)

// 导航项
const navItems = [
  { name: '首页', icon: '🏠', route: '/', badge: false },
  { name: '清单', icon: '📝', route: '/shopping-list', badge: false },
  { name: '家庭厨房', icon: '👨‍👩‍👧', route: '/family', badge: false },
  { name: '菜单', icon: '📋', route: '/cart', badge: true },
  { name: '我的', icon: '👤', route: '/profile', badge: false },
]

// 导航
const navigate = (route) => {
  if (route) {
    router.push(route)
  }
}

// 判断是否选中
const isActive = (itemRoute) => {
  if (!itemRoute) return false
  // 精确匹配首页，其他用前缀匹配
  if (itemRoute === '/') {
    return route.path === '/'
  }
  return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
}
</script>

<style scoped>
.h-safe {
  height: env(safe-area-inset-bottom);
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.5rem;
  }
}
</style>
