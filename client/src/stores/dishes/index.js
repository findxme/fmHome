/**
 * 菜品 Store 主入口
 * 组合各个子 store，导出统一的 useDishStore
 */
import { defineStore } from 'pinia'
import { useDishStore as useDishCore } from './dishStore'
import { useCartStore as useCartCore } from './cartStore'
import { usePreferencesStore as usePreferencesCore } from './preferencesStore'

export const useDishStore = defineStore('dishes', () => {
  // 组合各个子 store
  const dishCore = useDishCore()
  const cartCore = useCartCore()
  const preferencesCore = usePreferencesCore()

  // 返回统一的 API（保持向后兼容）
  return {
    // 菜品相关
    dishes: dishCore.dishes,
    dailyRecommend: dishCore.dailyRecommend,
    categories: dishCore.categories,
    loading: dishCore.loading,
    currentDish: dishCore.currentDish,
    loadDishes: dishCore.loadDishes,
    loadDailyRecommend: dishCore.loadDailyRecommend,
    addCustomDish: dishCore.addCustomDish,
    deleteCustomDish: dishCore.deleteCustomDish,
    updateDish: dishCore.updateDish,

    // 购物车相关
    cart: cartCore.cart,
    loadCart: cartCore.loadCart,
    addToCart: cartCore.addToCart,
    removeFromCart: cartCore.removeFromCart,
    updateQuantity: cartCore.updateQuantity,
    clearCart: cartCore.clearCart,
    ingredientsSummary: cartCore.ingredientsSummary,

    // 偏好相关
    preferences: preferencesCore.preferences,
    loadPreferences: preferencesCore.loadPreferences,
    savePreferences: preferencesCore.savePreferences
  }
})