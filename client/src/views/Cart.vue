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
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">📋 菜单</h1>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🛒</div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">还没有选择菜品</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">去菜单页选择你喜欢的菜品吧</p>
        <button @click="$router.push('/')" class="px-6 py-3 bg-accent-500 text-white rounded-xl font-medium">
          去点餐
        </button>
      </div>

      <div v-else>
        <!-- 食材汇总预览 -->
        <div v-if="ingredientSummary.length > 0" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-gray-800 dark:text-white">🥬 食材汇总</h3>
            <span class="text-sm text-gray-500">{{ ingredientSummary.length }} 种食材</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ing in ingredientSummary.slice(0, 8)"
              :key="ing.name"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
            >
              {{ ing.name }} {{ ing.totalAmount }}
            </span>
            <span v-if="ingredientSummary.length > 8" class="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 rounded-full text-sm text-accent-600">
              +{{ ingredientSummary.length - 8 }} 更多
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            已选 {{ cartItems.length }} 道菜
          </h2>
          <button @click="clearCart" class="text-red-500 text-sm hover:text-red-600">
            清空
          </button>
        </div>

        <div class="space-y-3 mb-6">
          <div
            v-for="item in cartItems"
            :key="item.id"
            @click="goToDish(item.dish_id || item.id)"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <img
              :src="item.image_url || '/placeholder-dish.png'"
              :alt="item.name"
              class="w-20 h-20 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.category }} · {{ item.difficulty }}</p>
              <p class="text-xs text-accent-500 mt-1">点击查看做法</p>
            </div>
            <div class="flex items-center gap-3" @click.stop>
              <button
                @click="updateQuantity(item.dish_id, item.quantity - 1)"
                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-90 transition-all"
              >
                -
              </button>
              <span class="w-8 text-center font-medium dark:text-white">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.dish_id, item.quantity + 1)"
                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-90 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button @click="generateList" class="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 active:scale-95 transition-all">
          🛒 生成购物清单 ({{ ingredientSummary.length }} 种食材)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDishStore } from '@/stores/dishes'
import { shoppingApi } from '@/api'

const router = useRouter()
const store = useDishStore()

const cartItems = computed(() => store.cart)

// 计算食材汇总
const ingredientSummary = computed(() => {
  const summary = {}
  
  cartItems.value.forEach(item => {
    const quantity = item.quantity || 1
    // 尝试从 item 获取食材信息
    if (item.ingredients && Array.isArray(item.ingredients)) {
      item.ingredients.forEach(ing => {
        const name = ing.name || ing
        if (summary[name]) {
          summary[name].count += quantity
          summary[name].dishes.push(item.name)
        } else {
          summary[name] = {
            name,
            count: quantity,
            totalAmount: ing.amount || `${quantity}份`,
            dishes: [item.name]
          }
        }
      })
    }
  })
  
  return Object.values(summary)
})

const goToDish = (id) => {
  if (id) {
    router.push(`/dish/${id}`)
  }
}

const updateQuantity = (id, quantity) => {
  store.updateQuantity(id, quantity)
}

const clearCart = () => {
  store.clearCart()
}

const generateList = async () => {
  // 生成购物清单，包含食材汇总
  const listData = ingredientSummary.value.map(ing => ({
    id: `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: ing.name,
    dish_name: ing.dishes.join(', '),
    quantity: ing.count,
    amount: ing.totalAmount,
    checked: false
  }))
  
  // 如果没有食材信息，使用菜品名称
  if (listData.length === 0) {
    cartItems.value.forEach(item => {
      listData.push({
        id: `dish_${item.dish_id || item.id}`,
        name: item.name,
        dish_name: item.name,
        quantity: item.quantity || 1,
        checked: false
      })
    })
  }
  
  try {
    await shoppingApi.save({ 
      date: new Date().toISOString().split('T')[0], 
      items: listData 
    })
    router.push('/shopping-list')
  } catch (e) {
    // 错误处理
    router.push('/shopping-list')
  }
}
</script>
