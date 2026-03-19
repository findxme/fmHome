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
        <div class="ml-auto text-sm text-gray-400">下拉刷新</div>
      </div>
    </header>

    <PullRefresh @refresh="handleRefresh">
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
    </PullRefresh>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDishStore } from '@/stores/dishes'
import { shoppingApi } from '@/api'
import PullRefresh from '@/components/PullRefresh.vue'

const router = useRouter()
const store = useDishStore()

const cartItems = computed(() => store.cart)

// 下拉刷新 - 重新加载菜品数据
const handleRefresh = async () => {
  await store.loadDishes(true)
}

// 计算食材汇总
const ingredientSummary = computed(() => {
  const summary = {}

  // 解析数量字符串，提取数值和单位
  const parseAmount = (amountStr) => {
    if (!amountStr || typeof amountStr !== 'string') return null
    const match = amountStr.match(/^([\d.]+)\s*(.+)$/)
    if (match) {
      return { value: parseFloat(match[1]), unit: match[2].trim() }
    }
    return null
  }

  // 格式化数量
  const formatAmount = (value, unit) => {
    return value % 1 === 0 ? `${value}${unit}` : `${value.toFixed(1)}${unit}`
  }

  cartItems.value.forEach(item => {
    const quantity = item.quantity || 1
    // 尝试从 item 获取食材信息（ingredients 在数据库中是 JSON 字符串）
    let ingredients = item.ingredients
    if (typeof ingredients === 'string') {
      try {
        ingredients = JSON.parse(ingredients)
      } catch (e) {
        ingredients = null
      }
    }
    if (ingredients && Array.isArray(ingredients)) {
      ingredients.forEach(ing => {
        const name = ing.name || ing
        const amount = ing.amount || `${quantity}份`
        if (summary[name]) {
          summary[name].count += quantity
          summary[name].dishes.push(item.name)
          // 智能合并数量
          const parsed = parseAmount(amount)
          const existingParsed = parseAmount(summary[name].rawAmount)
          if (parsed && existingParsed && parsed.unit === existingParsed.unit) {
            // 相同单位，合并数值
            summary[name].rawAmount = formatAmount(existingParsed.value + parsed.value, parsed.unit)
            summary[name].totalAmount = summary[name].rawAmount
          } else {
            // 不同单位或无法解析，追加显示
            if (!summary[name].amounts.includes(amount)) {
              summary[name].amounts.push(amount)
            }
            summary[name].totalAmount = summary[name].amounts.join(' + ')
          }
        } else {
          summary[name] = {
            name,
            count: quantity,
            totalAmount: amount,
            rawAmount: amount,
            amounts: [amount],
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

// 根据食材名称和单位生成稳定的 ID
const generateIngredientId = (name, unit = '') => {
  const normalizedUnit = unit.replace(/[\d.\s]/g, '').trim()
  const baseStr = `${name}_${normalizedUnit}`.toLowerCase()
  let hash = 0
  for (let i = 0; i < baseStr.length; i++) {
    const char = baseStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `ing_${Math.abs(hash).toString(36)}_${name.replace(/\s+/g, '_')}`
}

const generateList = async () => {
  // 生成购物清单，包含食材汇总
  const listData = ingredientSummary.value.map(ing => {
    // 提取单位用于生成稳定 ID
    const unitMatch = ing.rawAmount?.match(/^[\d.]+\s*(.+)$/)
    const unit = unitMatch ? unitMatch[1].trim() : ''
    const stableId = generateIngredientId(ing.name, unit)

    return {
      id: stableId,
      name: ing.name,
      dish_name: ing.dishes.join(', '),
      quantity: ing.count,
      amount: ing.totalAmount,
      unit: unit,
      checked: false
    }
  })

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

  const today = new Date().toISOString().split('T')[0]

  try {
    // 先查询今天是否已有购物清单
    const existingRes = await shoppingApi.get(today)
    const existingList = existingRes.data?.data

    if (existingList && existingList.id) {
      // 合并现有清单和新清单（基于食材名称匹配，智能合并数量）
      const existingItems = existingList.items || []
      const mergedItems = [...existingItems]

      // 添加新项目（智能去重合并）
      listData.forEach(newItem => {
        const existIndex = mergedItems.findIndex(e =>
          e.name === newItem.name && (e.unit === newItem.unit || !e.unit || !newItem.unit)
        )

        if (existIndex === -1) {
          // 新食材，直接添加
          mergedItems.push(newItem)
        } else {
          // 已存在相同食材，智能合并
          const existing = mergedItems[existIndex]

          // 合并菜品来源
          const existingDishes = existing.dish_name?.split(', ') || []
          const newDishes = newItem.dish_name?.split(', ') || []
          const mergedDishes = [...new Set([...existingDishes, ...newDishes])]
          existing.dish_name = mergedDishes.join(', ')

          // 合并数量
          existing.quantity = (existing.quantity || 1) + (newItem.quantity || 1)

          // 智能合并 amount（如果有单位）
          if (newItem.unit && existing.unit && newItem.unit === existing.unit) {
            // 相同单位，尝试数值相加
            const existingNum = parseFloat(existing.amount) || 0
            const newNum = parseFloat(newItem.amount) || 0
            if (existingNum && newNum) {
              existing.amount = `${(existingNum + newNum).toFixed(1).replace(/\.0$/, '')}${newItem.unit}`
            }
          } else if (!existing.amount && newItem.amount) {
            existing.amount = newItem.amount
          }
        }
      })

      // 更新现有清单
      await shoppingApi.update(existingList.id, mergedItems)
    } else {
      // 创建新清单
      await shoppingApi.save({
        date: today,
        items: listData
      })
    }
    router.push('/shopping-list')
  } catch (e) {
    console.error('生成购物清单失败:', e)
    alert('生成购物清单失败，请重试')
  }
}
</script>
