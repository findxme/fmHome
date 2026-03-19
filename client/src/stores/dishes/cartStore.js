/**
 * 购物车 Store
 * 负责购物车 CRUD 操作
 */
import { ref, computed } from 'vue'
import { cartApi } from '@/api'

export function useCartStore() {
  const cart = ref([])

  // 加载购物车
  const loadCart = async () => {
    try {
      const res = await cartApi.getAll()
      cart.value = res.data.data || []
    } catch (e) {
      cart.value = []
    }
  }

  // 添加到购物车
  const addToCart = async (dish) => {
    try {
      await cartApi.add({ dish_id: dish.id, dish_name: dish.name, quantity: 1 })
      await loadCart()
    } catch (e) {
      throw e
    }
  }

  // 从购物车移除
  const removeFromCart = async (dishId) => {
    try {
      await cartApi.remove(dishId)
      cart.value = cart.value.filter(item => item.dish_id !== dishId)
    } catch (e) {
      throw e
    }
  }

  // 更新购物车数量
  const updateQuantity = async (dishId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(dishId)
      } else {
        await cartApi.update(dishId, { quantity })
        await loadCart()
      }
    } catch (e) {
      throw e
    }
  }

  // 清空购物车
  const clearCart = async () => {
    try {
      await cartApi.clear()
      cart.value = []
    } catch (e) {
      throw e
    }
  }

  // 计算购物车中的食材汇总
  const ingredientsSummary = computed(() => {
    const summary = {}
    cart.value.forEach(item => {
      if (item.ingredients) {
        item.ingredients.forEach(ing => {
          if (summary[ing]) {
            summary[ing]++
          } else {
            summary[ing] = 1
          }
        })
      }
    })
    return summary
  })

  // 初始化时加载购物车
  loadCart()

  return {
    cart,
    loadCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    ingredientsSummary
  }
}