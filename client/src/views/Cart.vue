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
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">🛒 购物车</h1>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6">
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🛒</div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">购物车是空的</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-6">去菜单页选择你喜欢的菜品吧</p>
        <button @click="$router.push('/')" class="px-6 py-3 bg-accent-500 text-white rounded-xl font-medium">
          去点餐
        </button>
      </div>

      <div v-else>
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
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-4"
          >
            <img
              :src="item.image_url || '/placeholder-dish.png'"
              :alt="item.name"
              class="w-20 h-20 rounded-lg object-cover"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800 dark:text-white">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.category }} · {{ item.difficulty }}</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                @click="updateQuantity(item.id, item.quantity - 1)"
                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-90 transition-all"
              >
                -
              </button>
              <span class="w-8 text-center font-medium dark:text-white">{{ item.quantity }}</span>
              <button
                @click="updateQuantity(item.id, item.quantity + 1)"
                class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-90 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button @click="generateList" class="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 active:scale-95 transition-all">
          生成购物清单
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

const updateQuantity = (id, quantity) => {
  store.updateQuantity(id, quantity)
}

const clearCart = () => {
  store.clearCart()
}

const generateList = async () => {
  // 保存购物清单到数据库
  const listData = store.cart.map(item => ({
    dish_id: item.dish_id,
    dish_name: item.dish_name,
    quantity: item.quantity,
    checked: false
  }))
  
  try {
    // 清空旧的购物清单，保存新的
    await shoppingApi.save({ items: listData })
    router.push('/shopping-list')
  } catch (e) {
    console.error('保存购物清单失败:', e)
    // 降级到 localStorage
    localStorage.setItem('fmhome_shopping_list', JSON.stringify(store.cart))
    router.push('/shopping-list')
  }
}
</script>
