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
        <h1 class="text-xl font-bold text-gray-800 dark:text-white">{{ isEditMode ? '✏️ 编辑菜品' : '➕ 添加菜品' }}</h1>
      </div>
    </header>

    <!-- 添加菜品表单 -->
    <div class="max-w-4xl mx-auto px-4 py-6 pb-24">
      <form @submit.prevent="saveDish" class="space-y-6">
        <!-- 菜品图片 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            菜品图片（可多选）
          </label>

          <!-- 图片预览 -->
          <div v-if="dish.images && dish.images.length > 0" class="mb-4">
            <div class="flex gap-2 overflow-x-auto pb-2">
              <div v-for="(img, idx) in dish.images" :key="idx" class="relative flex-shrink-0">
                <img :src="img" alt="预览" class="w-20 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="removeImage(idx)"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 图片选择 -->
          <div class="mb-3">
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-2">快捷选择（点击添加多张）</label>
            <div class="flex gap-2 overflow-x-auto pb-2">
              <button
                v-for="(img, index) in imageOptions"
                :key="index"
                type="button"
                @click="addImage(img)"
                class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all active:scale-95"
                :class="dish.images && dish.images.includes(img) ? 'border-accent-500 ring-2 ring-accent-500/30' : 'border-transparent hover:border-gray-300'"
              >
                <img :src="img" alt="选项" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- 自定义URL -->
          <div class="flex gap-2">
            <input
              v-model="customImageUrl"
              type="text"
              placeholder="输入图片链接添加..."
              class="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
            />
            <button
              type="button"
              @click="addCustomImage"
              class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 active:scale-95 transition-all"
            >
              添加
            </button>
          </div>
        </div>

        <!-- 视频教程 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            视频教程（选填）
          </label>
          <input
            v-model="dish.video"
            type="text"
            placeholder="输入视频链接（B站/抖音/小红书）"
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">支持B站、抖音、小红书等视频链接</p>
        </div>

        <!-- 菜品名称 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            菜品名称 *
          </label>
          <input
            v-model="dish.name"
            type="text"
            required
            placeholder="输入菜品名称，如：红烧肉"
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
          />
        </div>

        <!-- 分类和基本信息 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <h3 class="font-medium text-gray-800 dark:text-white mb-4">基本信息</h3>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分类</label>
              <select
                v-model="dish.category"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              >
                <option value="早餐">早餐</option>
                <option value="午餐">午餐</option>
                <option value="晚餐">晚餐</option>
                <option value="素菜">素菜</option>
                <option value="汤类">汤类</option>
                <option value="甜品">甜品</option>
                <option value="饮品">饮品</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">难度</label>
              <select
                v-model="dish.difficulty"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              >
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">烹饪时间</label>
            <input
              v-model="dish.cooking_time"
              type="text"
              placeholder="如：30分钟"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">用餐人数</label>
            <input
              v-model="dish.servings"
              type="text"
              placeholder="如：2-3人份"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
            />
          </div>
        </div>

        <!-- 菜品描述 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            菜品描述
          </label>
          <textarea
            v-model="dish.description"
            rows="3"
            placeholder="描述这道菜的特点..."
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white resize-none"
          ></textarea>
        </div>

        <!-- 标签 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            标签（用逗号分隔）
          </label>
          <input
            v-model="dish.tags"
            type="text"
            placeholder="如：红烧,五花肉,家常菜"
            class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
          />
        </div>

        <!-- 食材清单 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-800 dark:text-white">🛒 食材清单</h3>
            <button
              type="button"
              @click="addIngredient"
              class="text-accent-500 hover:text-accent-600 text-sm font-medium active:scale-95 transition-transform"
            >
              + 添加食材
            </button>
          </div>

          <div v-if="dish.ingredients.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>暂无食材，点击上方按钮添加</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="(ing, index) in dish.ingredients"
              :key="index"
              class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <select
                v-model="ing.category"
                class="px-2 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
              >
                <option value="主料">主料</option>
                <option value="调料">调料</option>
                <option value="香料">香料</option>
              </select>
              <input
                v-model="ing.name"
                type="text"
                placeholder="食材名称"
                class="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
              />
              <input
                v-model="ing.amount"
                type="text"
                placeholder="用量"
                class="w-20 px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="p-2 text-red-500 hover:text-red-600 active:text-red-700 active:scale-90 transition-all"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 制作步骤 -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-800 dark:text-white">📝 制作步骤</h3>
            <button
              type="button"
              @click="addStep"
              class="text-accent-500 hover:text-accent-600 text-sm font-medium active:scale-95 transition-transform"
            >
              + 添加步骤
            </button>
          </div>

          <div v-if="dish.steps.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            <p>暂无步骤，点击上方按钮添加</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(step, index) in dish.steps"
              :key="index"
              class="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {{ index + 1 }}
                </span>
                <input
                  v-model="step.title"
                  type="text"
                  placeholder="步骤标题"
                  class="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
                />
                <button
                  type="button"
                  @click="removeStep(index)"
                  class="p-2 text-red-500 hover:text-red-600 active:text-red-700 active:scale-90 transition-all"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <textarea
                v-model="step.description"
                rows="2"
                placeholder="详细描述这个步骤..."
                class="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white resize-none text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button
          type="submit"
          :disabled="!dish.name"
          class="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium shadow-lg shadow-accent-500/30 hover:shadow-xl hover:shadow-accent-500/40 active:scale-95 active:brightness-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 {{ isEditMode ? '保存修改' : '保存菜品' }}
        </button>
      </form>
    </div>

    <!-- Toast -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-8"
    >
      <div v-if="toast.show" class="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
        <div class="flex items-center gap-2 px-4 py-3 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-full shadow-lg">
          <span>{{ toast.icon }}</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDishStore } from '@/stores/dishes'
import { v4 as uuidv4 } from 'uuid'

const router = useRouter()
const route = useRoute()
const dishStore = useDishStore()

// 编辑模式
const isEditMode = ref(false)
const editDishId = ref('')

// 美食图片选项
const imageOptions = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
  'https://images.unsplash.com/photo-1525755662778-989d0524087?w=400',
  'https://images.unsplash.com/photo-1603133872878-684f5c9322ed?w=400',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
  'https://images.unsplash.com/photo-1623595119708-26b1f7300075?w=400',
]

const customImageUrl = ref('')

// 检查编辑模式
onMounted(() => {
  if (route.query.edit && route.query.data) {
    try {
      const editData = JSON.parse(route.query.data)
      isEditMode.value = true
      editDishId.value = editData.id

      // 填充表单数据
      dish.name = editData.name || ''
      dish.category = editData.category || '午餐'
      dish.difficulty = editData.difficulty || '中等'
      dish.cooking_time = editData.cooking_time || ''
      dish.servings = editData.servings || ''
      dish.description = editData.description || ''
      dish.tags = editData.tags || ''
      dish.image_url = editData.image_url || ''
      dish.ingredients = editData.ingredients || []
      dish.steps = editData.steps || []
    } catch (e) {
      console.error('解析编辑数据失败:', e)
    }
  }
})

const dish = reactive({
  name: '',
  category: '午餐',
  difficulty: '中等',
  cooking_time: '',
  servings: '',
  description: '',
  tags: '',
  images: [],
  video: '',
  ingredients: [],
  steps: []
})

// 图片处理函数
const addImage = (url) => {
  if (!dish.images) {
    dish.images = []
  }
  if (!dish.images.includes(url)) {
    dish.images.push(url)
  }
}

const addCustomImage = () => {
  if (customImageUrl.value.trim()) {
    addImage(customImageUrl.value.trim())
    customImageUrl.value = ''
  }
}

const removeImage = (index) => {
  dish.images.splice(index, 1)
}

const toast = ref({ show: false, message: '', icon: '' })

const showToast = (icon, message) => {
  toast.value = { show: true, icon, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const addIngredient = () => {
  dish.ingredients.push({ name: '', amount: '', category: '主料' })
}

const removeIngredient = (index) => {
  dish.ingredients.splice(index, 1)
}

const addStep = () => {
  dish.steps.push({ title: '', description: '', phase: '主料' })
}

const removeStep = (index) => {
  dish.steps.splice(index, 1)
}

const saveDish = () => {
  const filteredIngredients = dish.ingredients.filter(i => i.name && i.name.trim())
  const filteredSteps = dish.steps.filter(s => (s.title && s.title.trim()) || (s.description && s.description.trim()))

  if (isEditMode.value) {
    // 编辑模式：更新菜品
    const updatedData = {
      name: dish.name,
      category: dish.category,
      difficulty: dish.difficulty,
      cooking_time: dish.cooking_time,
      servings: dish.servings,
      description: dish.description,
      tags: dish.tags,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      images: dish.images && dish.images.length > 0 ? dish.images : [dish.image_url || imageOptions[0]],
      video: dish.video || '',
      image_url: dish.images?.[0] || dish.image_url || imageOptions[0]
    }

    // 更新本地存储
    if (editDishId.value.startsWith('custom_')) {
      const customDishes = JSON.parse(localStorage.getItem('fmhome_custom_dishes') || '[]')
      const index = customDishes.findIndex(d => d.id === editDishId.value)
      if (index !== -1) {
        customDishes[index] = { ...customDishes[index], ...updatedData }
        localStorage.setItem('fmhome_custom_dishes', JSON.stringify(customDishes))
      }
    } else if (editDishId.value.startsWith('sample_')) {
      // 示例菜品更新
      const sampleDishes = JSON.parse(localStorage.getItem('fmhome_sample_dishes') || '[]')
      const index = sampleDishes.findIndex(d => d.id === editDishId.value)
      if (index !== -1) {
        sampleDishes[index] = { ...sampleDishes[index], ...updatedData }
        localStorage.setItem('fmhome_sample_dishes', JSON.stringify(sampleDishes))
      }
    }

    // 更新 store
    dishStore.updateDish(editDishId.value, updatedData)
    showToast('✅', '菜品更新成功！')
  } else {
    // 新增模式
    const newDish = {
      id: `custom_${uuidv4().slice(0, 8)}`,
      name: dish.name,
      category: dish.category,
      difficulty: dish.difficulty,
      cooking_time: dish.cooking_time,
      servings: dish.servings,
      description: dish.description,
      tags: dish.tags,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      images: dish.images && dish.images.length > 0 ? dish.images : [dish.image_url || imageOptions[0]],
      video: dish.video || '',
      image_url: dish.images?.[0] || dish.image_url || imageOptions[0],
      rating: '5.0',
      isCustom: true,
      createdAt: new Date().toISOString()
    }

    // 保存到本地存储
    const customDishes = JSON.parse(localStorage.getItem('fmhome_custom_dishes') || '[]')
    customDishes.unshift(newDish)
    localStorage.setItem('fmhome_custom_dishes', JSON.stringify(customDishes))

    // 添加到 store
    dishStore.addCustomDish(newDish)
    showToast('✅', '菜品添加成功！')
  }

  setTimeout(() => {
    router.push('/')
  }, 1000)
}
</script>
