/**
 * 菜品数据 Store
 * 负责菜品加载、分类、搜索、每日推荐等
 */
import { ref } from 'vue'
import { dishApi } from '@/api'
import { getSampleDishes } from './sampleData'

export function useDishStore() {
  const dishes = ref([])
  const dailyRecommend = ref([])
  const categories = ref([])
  const loading = ref(false)
  const currentDish = ref(null)

  // 加载菜品列表 - 从 MySQL 获取
  const loadDishes = async (forceRefresh = false) => {
    if (forceRefresh) {
      dishes.value = []
    }
    loading.value = true
    try {
      const res = await dishApi.getAll()
      dishes.value = res.data.data || []

      // 如果数据库为空，加载示例菜品
      if (dishes.value.length === 0) {
        await loadSampleDishesToDatabase()
      }
    } catch (e) {
      dishes.value = []
    } finally {
      loading.value = false
    }
  }

  // 将示例菜品加载到数据库
  const loadSampleDishesToDatabase = async () => {
    const sampleDishes = getSampleDishes()
    for (const dish of sampleDishes) {
      try {
        await dishApi.create({
          id: dish.id,
          ...dish
        })
      } catch (e) {
        // 菜品已存在
      }
    }
    const res = await dishApi.getAll()
    dishes.value = res.data.data || []
  }

  // 加载每日推荐
  const loadDailyRecommend = async () => {
    try {
      const res = await dishApi.getDailyRecommend()
      dailyRecommend.value = res.data.data || []
    } catch (e) {
      dailyRecommend.value = []
    }
  }

  // 添加自定义菜品
  const addCustomDish = async (dish) => {
    try {
      const newDish = {
        id: `custom_${Date.now()}`,
        ...dish,
        isSample: false
      }
      await dishApi.create(newDish)
      dishes.value.unshift(newDish)
      return newDish
    } catch (e) {
      throw e
    }
  }

  // 删除菜品
  const deleteCustomDish = async (dishId) => {
    try {
      await dishApi.delete(dishId)
      dishes.value = dishes.value.filter(d => d.id !== dishId)
    } catch (e) {
      throw e
    }
  }

  // 更新菜品
  const updateDish = async (dishId, updatedData) => {
    try {
      await dishApi.update(dishId, updatedData)
      const index = dishes.value.findIndex(d => d.id === dishId)
      if (index !== -1) {
        dishes.value[index] = { ...dishes.value[index], ...updatedData }
      }
    } catch (e) {
      throw e
    }
  }

  return {
    dishes,
    dailyRecommend,
    categories,
    loading,
    currentDish,
    loadDishes,
    loadDailyRecommend,
    addCustomDish,
    deleteCustomDish,
    updateDish
  }
}