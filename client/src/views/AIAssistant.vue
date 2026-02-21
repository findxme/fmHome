<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-r from-purple-500 to-pink-500 text-white sticky top-0 z-30 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-4 flex items-center gap-4">
        <button @click="$router.back()" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">🤖 AI 厨房助手</h1>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-4 pb-24">
      <!-- 功能选择 -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <button
          v-for="feature in features"
          :key="feature.id"
          @click="activeFeature = feature.id"
          class="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-center hover:shadow-md transition-all"
          :class="{ 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20': activeFeature === feature.id }"
        >
          <span class="text-2xl block mb-1">{{ feature.icon }}</span>
          <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ feature.title }}</span>
        </button>
      </div>

      <!-- 智能推荐 -->
      <div v-if="activeFeature === 'recommend'" class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-4">🍽️ 智能推荐</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">口味偏好</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="taste in tasteOptions"
                  :key="taste"
                  @click="recommendParams.taste = taste"
                  class="px-4 py-2 rounded-full text-sm transition-all"
                  :class="recommendParams.taste === taste
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'"
                >
                  {{ taste }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">难度</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="diff in difficultyOptions"
                  :key="diff"
                  @click="recommendParams.difficulty = diff"
                  class="px-4 py-2 rounded-full text-sm transition-all"
                  :class="recommendParams.difficulty === diff
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'"
                >
                  {{ diff }}
                </button>
              </div>
            </div>

            <button @click="getRecommend" class="btn-primary w-full" :disabled="recommendLoading">
              {{ recommendLoading ? '🤔 AI推荐中...' : '✨ 获取推荐' }}
            </button>
          </div>

          <div v-if="recommendResult.length > 0" class="mt-6 grid grid-cols-2 gap-3">
            <div
              v-for="dish in recommendResult"
              :key="dish.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              @click="$router.push(`/dish/${dish.id}`)"
            >
              <img :src="dish.image_url" :alt="dish.name" class="w-full h-24 rounded-lg object-cover mb-2" />
              <p class="font-medium text-sm text-gray-800 dark:text-white">{{ dish.name }}</p>
              <p class="text-xs text-gray-500">{{ dish.cooking_time }} · {{ dish.difficulty }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- AI生成菜品 -->
      <div v-if="activeFeature === 'generate'" class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-2">🎨 AI创作菜品</h2>
          <p class="text-sm text-gray-500 mb-4">描述你想要的菜品，AI帮你生成完整菜谱</p>

          <textarea
            v-model="generatePrompt"
            placeholder="例如：我想吃一道酸甜可口的家常菜，用鸡肉和番茄来做..."
            rows="4"
            class="w-full p-3 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          <button @click="generateDish" class="btn-primary w-full mt-4" :disabled="generateLoading">
            {{ generateLoading ? '🎨 AI创作中...' : '🚀 生成菜谱' }}
          </button>
        </div>

        <div v-if="generatedDish" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-4">{{ generatedDish.name }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ generatedDish.description }}</p>

          <div class="mb-4">
            <h4 class="font-medium text-gray-800 dark:text-white mb-2">📝 所需食材</h4>
            <ul class="space-y-1">
              <li v-for="(ing, idx) in generatedDish.ingredients" :key="idx" class="text-sm text-gray-600 dark:text-gray-400">
                {{ ing }}
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-medium text-gray-800 dark:text-white mb-2">👨‍🍳 烹饪步骤</h4>
            <ol class="space-y-2">
              <li v-for="(step, idx) in generatedDish.steps" :key="idx" class="text-sm text-gray-600 dark:text-gray-400 flex gap-2">
                <span class="text-purple-500 font-bold">{{ idx + 1 }}.</span>
                {{ step }}
              </li>
            </ol>
          </div>

          <button @click="saveGeneratedDish" class="w-full mt-4 py-3 bg-green-500 text-white font-bold rounded-xl">
            💾 保存到我的菜谱
          </button>
        </div>
      </div>

      <!-- 营养问答 -->
      <div v-if="activeFeature === 'nutrition'" class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-2">🥗 营养问答</h2>
          <p class="text-sm text-gray-500 mb-4">问AI关于食物营养搭配的问题</p>

          <textarea
            v-model="nutritionQuestion"
            placeholder="例如：番茄炒蛋的热量高吗？减肥期间能吃吗？"
            rows="3"
            class="w-full p-3 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="q in nutritionQuickQuestions"
              :key="q"
              @click="nutritionQuestion = q"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200"
            >
              {{ q }}
            </button>
          </div>

          <button @click="askNutrition" class="btn-primary w-full mt-4" :disabled="nutritionLoading">
            {{ nutritionLoading ? '🤔 AI思考中...' : '💬 提问' }}
          </button>
        </div>

        <div v-if="nutritionAnswer" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h4 class="font-medium text-gray-800 dark:text-white mb-2">📋 AI 回答</h4>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ nutritionAnswer }}</p>
        </div>

        <!-- 营养小贴士 -->
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-4">
          <h3 class="font-medium text-green-700 dark:text-green-400 mb-2">💡 今日营养小贴士</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ dailyNutritionTip }}</p>
        </div>
      </div>

      <!-- 卡路里计算 -->
      <div v-if="activeFeature === 'calorie'" class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-2">🔥 卡路里计算器</h2>
          <p class="text-sm text-gray-500 mb-4">输入食材，计算热量</p>

          <div class="flex gap-2 mb-4">
            <input
              v-model="calorieInput"
              type="text"
              placeholder="输入食材名称和量，如：米饭 100克"
              class="flex-1 p-3 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button @click="calculateCalorie" :disabled="calorieLoading" class="px-4 py-2 bg-purple-500 text-white rounded-xl">
              计算
            </button>
          </div>

          <div v-if="calorieResult" class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
            <div class="text-center">
              <p class="text-4xl font-bold text-purple-600 dark:text-purple-400">{{ calorieResult.calories }}</p>
              <p class="text-sm text-gray-500">千卡</p>
            </div>
            <div class="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ calorieResult.protein }}g</p>
                <p class="text-gray-500">蛋白质</p>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ calorieResult.fat }}g</p>
                <p class="text-gray-500">脂肪</p>
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ calorieResult.carbs }}g</p>
                <p class="text-gray-500">碳水</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 烹饪问答 -->
      <div v-if="activeFeature === 'chat'" class="space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h2 class="font-semibold text-gray-800 dark:text-white mb-2">💬 烹饪问答</h2>
          <p class="text-sm text-gray-500 mb-4">任何烹饪问题都可以问我</p>

          <textarea
            v-model="chatQuestion"
            placeholder="输入你的烹饪问题..."
            rows="3"
            class="w-full p-3 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>

          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="q in quickQuestions"
              :key="q"
              @click="chatQuestion = q"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full hover:bg-gray-200"
            >
              {{ q }}
            </button>
          </div>

          <button @click="askQuestion" class="btn-primary w-full mt-4" :disabled="chatLoading">
            {{ chatLoading ? '🤔 AI思考中...' : '💬 提问' }}
          </button>
        </div>

        <div v-if="chatAnswer" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <h4 class="font-medium text-gray-800 dark:text-white mb-2">🤖 AI 回答</h4>
          <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ chatAnswer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { aiApi } from '@/api'
import { useDishStore } from '@/stores/dishes'

const dishStore = useDishStore()

const activeFeature = ref('recommend')

const features = [
  { id: 'recommend', icon: '🍽️', title: '推荐' },
  { id: 'generate', icon: '🎨', title: '创作' },
  { id: 'nutrition', icon: '🥗', title: '营养' },
  { id: 'calorie', icon: '🔥', title: '热量' },
]

// 智能推荐
const tasteOptions = ['不限', '辣', '清淡', '甜', '酸']
const difficultyOptions = ['不限', '简单', '中等', '困难']

const recommendParams = reactive({
  taste: '不限',
  difficulty: '不限',
  count: 6
})

const recommendLoading = ref(false)
const recommendResult = ref([])

const getRecommend = async () => {
  recommendLoading.value = true
  try {
    const res = await aiApi.recommend(recommendParams)
    recommendResult.value = res.data.data || []
  } catch (e) {
    console.error('推荐失败:', e)
  } finally {
    recommendLoading.value = false
  }
}

// AI生成菜品
const generatePrompt = ref('')
const generateLoading = ref(false)
const generatedDish = ref(null)

const generateDish = async () => {
  if (!generatePrompt.value.trim()) return

  generateLoading.value = true
  try {
    const res = await aiApi.chat({
      question: `请根据以下描述生成一道完整的菜谱，包括菜名、描述、所需食材和烹饪步骤。格式请按JSON返回：${generatePrompt.value}`
    })

    if (res.data.data) {
      // 尝试解析JSON
      try {
        const jsonMatch = res.data.data.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const dish = JSON.parse(jsonMatch[0])
          generatedDish.value = {
            name: dish.name || 'AI创作菜品',
            description: dish.description || '',
            ingredients: dish.ingredients || [],
            steps: dish.steps || []
          }
        }
      } catch (e) {
        // 解析失败，使用默认格式
        generatedDish.value = {
          name: 'AI创作菜品',
          description: generatePrompt.value,
          ingredients: ['根据AI生成的菜谱添加'],
          steps: ['请查看AI回答获取详细步骤']
        }
      }
    }
  } catch (e) {
    console.error('生成失败:', e)
  } finally {
    generateLoading.value = false
  }
}

const saveGeneratedDish = () => {
  if (!generatedDish.value) return

  const newDish = {
    id: 'custom_' + Date.now(),
    name: generatedDish.value.name,
    description: generatedDish.value.description,
    category: 'AI创作',
    difficulty: '中等',
    cooking_time: '30分钟',
    ingredients: generatedDish.value.ingredients.map(i => ({ name: i, amount: '适量', category: '其他' })),
    steps: generatedDish.value.steps.map((s, i) => ({ title: `步骤${i+1}`, description: s })),
    isSample: false
  }

  dishStore.addCustomDish(newDish)
  alert('菜谱已保存！')
  generatedDish.value = null
  generatePrompt.value = ''
}

// 营养问答
const nutritionQuestion = ref('')
const nutritionLoading = ref(false)
const nutritionAnswer = ref('')

const nutritionQuickQuestions = [
  '番茄炒蛋有营养吗？',
  '减肥能吃红烧肉吗？',
  '哪些食物维生素C多？',
  '早餐吃什么最健康？'
]

const dailyNutritionTips = [
  '每天摄入足够的蛋白质有助于维持肌肉质量，鸡蛋、鱼肉、豆制品都是优质蛋白来源。',
  '多吃深色蔬菜如菠菜、西兰花，营养价值更高。',
  '适量摄入坚果有益健康，但每天不要超过一小把。',
  '多喝水！成人每天应喝8杯水，约2升。',
  '晚餐尽量在睡前3小时吃完，有助于消化和睡眠。'
]

const dailyNutritionTip = dailyNutritionTips[Math.floor(Math.random() * dailyNutritionTips.length)]

const askNutrition = async () => {
  if (!nutritionQuestion.value.trim()) return

  nutritionLoading.value = true
  try {
    const res = await aiApi.chat({
      question: `营养问题：${nutritionQuestion.value}，请用通俗易懂的方式回答。`
    })
    if (res.data.data) {
      nutritionAnswer.value = res.data.data
    }
  } catch (e) {
    console.error('问答失败:', e)
  } finally {
    nutritionLoading.value = false
  }
}

// 卡路里计算
const calorieInput = ref('')
const calorieLoading = ref(false)
const calorieResult = ref(null)

const calculateCalorie = async () => {
  if (!calorieInput.value.trim()) return

  calorieLoading.value = true
  try {
    const res = await aiApi.chat({
      question: `请计算以下食物的热量和营养成分，只返回JSON格式：${calorieInput.value}。格式：{"calories":数字,"protein":数字,"fat":数字,"carbs":数字}`
    })

    if (res.data.data) {
      try {
        const jsonMatch = res.data.data.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          calorieResult.value = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        calorieResult.value = { calories: '? ', protein: '?', fat: '?', carbs: '?' }
      }
    }
  } catch (e) {
    console.error('计算失败:', e)
  } finally {
    calorieLoading.value = false
  }
}

// 烹饪问答
const chatQuestion = ref('')
const chatLoading = ref(false)
const chatAnswer = ref('')

const quickQuestions = [
  '红烧肉怎么做好吃？',
  '如何让炒菜更香？',
  '怎样去除腥味？',
  '煎鱼怎么不粘锅？'
]

const askQuestion = async () => {
  if (!chatQuestion.value.trim()) return

  chatLoading.value = true
  try {
    const res = await aiApi.chat({ question: chatQuestion.value })
    if (res.data.data) {
      chatAnswer.value = res.data.data
    }
  } catch (e) {
    console.error('问答失败:', e)
  } finally {
    chatLoading.value = false
  }
}
</script>

<style scoped>
.btn-primary {
  @apply py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50;
}
</style>
