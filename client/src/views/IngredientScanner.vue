<template>
  <div class="min-h-screen bg-gray-900 pb-20">
    <!-- 顶部 -->
    <div class="p-4 pt-12 text-white">
      <button @click="$router.back()" class="mb-4">← 返回</button>
      <h1 class="text-2xl font-bold mb-2">📸 食材扫描</h1>
      <p class="text-gray-400">拍照识别冰箱里的食材，AI帮你推荐菜谱</p>
    </div>

    <!-- 摄像头区域 -->
    <div class="relative mx-4 rounded-2xl overflow-hidden bg-black">
      <video
        ref="video"
        class="w-full h-64 object-cover"
        autoplay
        playsinline
      ></video>

      <!-- 拍照按钮 -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
        <button
          @click="captureImage"
          :disabled="isCapturing"
          class="w-16 h-16 rounded-full bg-white flex items-center justify-center disabled:opacity-50"
        >
          <div class="w-12 h-12 rounded-full border-4 border-gray-300"></div>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div class="text-white text-center">
          <div class="animate-spin text-4xl mb-2">⏳</div>
          <p>AI模型加载中...</p>
        </div>
      </div>
    </div>

    <!-- 识别结果 -->
    <div v-if="detectedIngredients.length > 0" class="p-4">
      <h2 class="text-lg font-semibold text-white mb-4">识别到的食材</h2>
      <div class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="ingredient in detectedIngredients"
          :key="ingredient"
          class="px-4 py-2 bg-green-500/20 text-green-400 rounded-full"
        >
          {{ ingredient }}
        </span>
      </div>

      <button
        @click="getRecipes"
        :disabled="isGettingRecipes"
        class="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
      >
        {{ isGettingRecipes ? 'AI推荐中...' : '🤖 AI推荐菜谱' }}
      </button>
    </div>

    <!-- 推荐结果 -->
    <div v-if="recipes.length > 0" class="p-4 pt-0">
      <h2 class="text-lg font-semibold text-white mb-4">推荐菜谱</h2>
      <div class="space-y-3">
        <div
          v-for="recipe in recipes"
          :key="recipe.name"
          class="bg-gray-800 rounded-2xl p-4"
        >
          <h3 class="font-bold text-white mb-2">{{ recipe.name }}</h3>
          <p class="text-sm text-gray-400 mb-2">{{ recipe.reason }}</p>
          <div class="flex gap-2 text-xs text-gray-500">
            <span>⏱️ {{ recipe.time || '未知' }}</span>
            <span>📊 {{ recipe.difficulty || '未知' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 手动输入 -->
    <div class="p-4 pt-0">
      <div class="border-t border-gray-800 pt-4">
        <p class="text-gray-500 text-center mb-4">或手动输入食材</p>
        <div class="flex gap-2">
          <input
            v-model="manualIngredient"
            type="text"
            placeholder="输入食材名称"
            class="flex-1 px-4 py-2 bg-gray-800 text-white rounded-xl border border-gray-700"
            @keyup.enter="addManualIngredient"
          />
          <button
            @click="addManualIngredient"
            class="px-4 py-2 bg-gray-700 text-white rounded-xl"
          >
            添加
          </button>
        </div>
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="ing in manualIngredients"
            :key="ing"
            class="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center gap-1"
          >
            {{ ing }}
            <button @click="removeIngredient(ing)" class="text-gray-500">×</button>
          </span>
        </div>
        <button
          v-if="manualIngredients.length > 0"
          @click="getRecipesFromManual"
          class="w-full mt-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl"
        >
          🤖 用这些食材推荐
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { aiApi } from '@/api'

const router = useRouter()

const video = ref(null)
const isLoading = ref(true)
const isCapturing = ref(false)
const isGettingRecipes = ref(false)
const detectedIngredients = ref([])
const manualIngredient = ref('')
const manualIngredients = ref([])
const recipes = ref([])

let stream = null
let model = null

// 食材关键词映射
const ingredientKeywords = {
  'apple': '苹果', 'banana': '香蕉', 'orange': '橙子', 'tomato': '番茄',
  'broccoli': '西兰花', 'carrot': '胡萝卜', 'onion': '洋葱', 'garlic': '大蒜',
  'pizza': '披萨', 'burger': '汉堡', 'hot dog': '热狗', 'ice cream': '冰淇淋',
  'pancake': '煎饼', 'waffle': '华夫饼', 'cheese': '奶酪', 'egg': '鸡蛋',
  'meat': '肉', 'chicken': '鸡肉', 'beef': '牛肉', 'pork': '猪肉',
  'fish': '鱼', 'shrimp': '虾', 'rice': '米饭', 'bread': '面包',
  'noodle': '面条', 'pasta': '意面', 'salad': '沙拉', 'sandwich': '三明治',
  'cake': '蛋糕', 'cookie': '饼干', 'chocolate': '巧克力', 'coffee': '咖啡',
  'juice': '果汁', 'milk': '牛奶', 'tea': '茶', 'wine': '葡萄酒'
}

onMounted(async () => {
  await initCamera()
  await loadModel()
})

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})

const initCamera = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    })
    if (video.value) {
      video.value.srcObject = stream
    }
  } catch (e) {
    console.error('摄像头初始化失败:', e)
    alert('无法访问摄像头，请检查权限')
  }
}

const loadModel = async () => {
  try {
    // 动态导入模型
    const tf = await import('@tensorflow/tfjs')
    const mobilenet = await import('@tensorflow-models/mobilenet')

    model = await mobilenet.load()
    isLoading.value = false
  } catch (e) {
    console.error('模型加载失败:', e)
    isLoading.value = false
    // 使用备用方案
    isLoading.value = false
  }
}

const captureImage = async () => {
  if (!model || !video.value) return

  isCapturing.value = true

  try {
    // 创建canvas
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video.value, 0, 0)

    // 识别
    const predictions = await model.classify(canvas)

    // 提取食材关键词
    const ingredients = predictions
      .filter(p => p.probability > 0.3)
      .map(p => {
        const name = p.className.toLowerCase()
        return ingredientKeywords[name] || name
      })

    detectedIngredients.value = [...new Set(ingredients)]

    if (detectedIngredients.value.length === 0) {
      alert('未能识别到常见食材，请尝试手动输入')
    }
  } catch (e) {
    console.error('识别失败:', e)
    alert('识别失败，请重试')
  }

  isCapturing.value = false
}

const getRecipes = async () => {
  if (detectedIngredients.value.length === 0) return

  isGettingRecipes.value = true

  try {
    const res = await aiApi.ingredientRecipe({
      ingredients: detectedIngredients.value
    })

    if (res.data.success && res.data.data?.recipes) {
      recipes.value = res.data.data.recipes
    }
  } catch (e) {
    console.error('获取菜谱失败:', e)
  }

  isGettingRecipes.value = false
}

const addManualIngredient = () => {
  if (!manualIngredient.value.trim()) return

  manualIngredients.value.push(manualIngredient.value.trim())
  manualIngredient.value = ''
}

const removeIngredient = (ing) => {
  manualIngredients.value = manualIngredients.value.filter(i => i !== ing)
}

const getRecipesFromManual = async () => {
  if (manualIngredients.value.length === 0) return

  isGettingRecipes.value = true

  try {
    const res = await aiApi.ingredientRecipe({
      ingredients: manualIngredients.value
    })

    if (res.data.success && res.data.data?.recipes) {
      recipes.value = res.data.data.recipes
    }
  } catch (e) {
    console.error('获取菜谱失败:', e)
  }

  isGettingRecipes.value = false
}
</script>
