<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30 transition-colors duration-300 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-3">
        <div class="flex items-center justify-between">
          <button @click="$router.back()" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg class="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-lg font-bold text-gray-800 dark:text-white">📝 购物清单</h1>
          <button @click="showHistory = !showHistory" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="采购历史">
            <span class="text-xl">📊</span>
          </button>
        </div>

        <!-- 标签切换 -->
        <div class="flex gap-2 mt-3">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
            :class="activeTab === tab.id
              ? 'bg-accent-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'"
          >
            {{ tab.icon }} {{ tab.name }}
          </button>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-4 pb-24">
      <!-- 日常采购模板 -->
      <div v-if="activeTab === 'template'">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-3">常用模板</h2>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div
            v-for="template in templates"
            :key="template.id"
            @click="useTemplate(template)"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">{{ template.icon }}</span>
              <span class="font-medium text-gray-800 dark:text-white">{{ template.name }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ template.items.length }} 种食材</p>
          </div>
        </div>

        <button
          @click="showSaveTemplate = true"
          class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 rounded-xl hover:border-accent-500 hover:text-accent-500 transition-colors"
        >
          + 保存当前清单为模板
        </button>
      </div>

      <!-- 当前清单 -->
      <div v-else-if="activeTab === 'current'">
        <div v-if="!hasItems" class="text-center py-12">
          <div class="text-6xl mb-4">🛒</div>
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">清单是空的</h2>
          <p class="text-gray-500 mb-6">选择一个模板或从购物车生成</p>
          <div class="flex gap-3 justify-center">
            <button @click="activeTab = 'template'" class="px-6 py-3 bg-accent-500 text-white rounded-xl font-medium">
              选择模板
            </button>
            <button @click="$router.push('/cart')" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-medium">
              去购物车
            </button>
          </div>
        </div>

        <div v-else>
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-500">{{ checkedCount }}/{{ totalCount }} 已采购</span>
            <button @click="clearList" class="text-red-500 text-sm hover:text-red-600">清空</button>
          </div>

          <!-- 清单内容 -->
          <ShoppingListOptimized
            :cart-items="shoppingListItems"
            @update="handleUpdate"
            @clear="clearList"
          />
        </div>
      </div>

      <!-- 采购历史 -->
      <div v-else-if="activeTab === 'history'">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-3">常购食材</h2>
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="item in frequentItems"
            :key="item.name"
            class="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300"
          >
            {{ item.name }} ({{ item.count }}次)
          </span>
        </div>

        <h2 class="font-semibold text-gray-800 dark:text-white mb-3">采购记录</h2>
        <div class="space-y-3">
          <div
            v-for="record in purchaseHistory"
            :key="record.date"
            class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="font-medium text-gray-800 dark:text-white">{{ record.date }}</span>
              <span class="text-sm text-gray-500">{{ record.items.length }}种食材</span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="item in record.items.slice(0, 5)"
                :key="item"
                class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
              >
                {{ item }}
              </span>
              <span v-if="record.items.length > 5" class="text-xs text-gray-400">
                +{{ record.items.length - 5 }}种
              </span>
            </div>
            <button
              @click="reuseHistory(record)"
              class="mt-2 text-sm text-accent-500 hover:text-accent-600"
            >
              再次采购 →
            </button>
          </div>
        </div>

        <div v-if="purchaseHistory.length === 0" class="text-center py-8">
          <p class="text-gray-500">暂无采购记录</p>
        </div>
      </div>
    </div>

    <!-- 保存模板弹窗 -->
    <div v-if="showSaveTemplate" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
        <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-4">保存为模板</h3>
        <input
          v-model="newTemplateName"
          type="text"
          placeholder="输入模板名称"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white mb-4"
        />
        <div class="flex gap-3">
          <button @click="showSaveTemplate = false" class="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl">
            取消
          </button>
          <button @click="saveAsTemplate" class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-medium">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDishStore } from '@/stores/dishes'
import { shoppingApi, templateApi, historyApi } from '@/api'
import ShoppingListOptimized from '@/components/ShoppingListOptimized.vue'

const router = useRouter()
const store = useDishStore()

const activeTab = ref('current')
const showHistory = ref(false)
const showSaveTemplate = ref(false)
const newTemplateName = ref('')

const tabs = [
  { id: 'current', name: '当前清单', icon: '🛒' },
  { id: 'template', name: '模板', icon: '📋' },
  { id: 'history', name: '历史', icon: '📊' }
]

// 购物清单数据
const shoppingListItems = ref([])
const currentListId = ref(null)

// 模板数据
const templates = ref([
  { id: 1, name: '早餐', icon: '🍳', items: ['鸡蛋', '牛奶', '面包', '培根', '番茄'] },
  { id: 2, name: '午餐', icon: '🍱', items: ['米饭', '鸡胸肉', '西兰花', '胡萝卜', '洋葱'] },
  { id: 3, name: '晚餐', icon: '🍲', items: ['米饭', '猪肉', '土豆', '青椒', '蒜苔'] },
  { id: 4, name: '每周常购', icon: '🛍️', items: ['鸡蛋', '牛奶', '面包', '大米', '食用油', '盐', '葱', '姜', '蒜'] }
])

// 采购历史
const purchaseHistory = ref([])
const frequentItems = ref([])

const hasItems = computed(() => shoppingListItems.value.length > 0)
const checkedCount = computed(() => shoppingListItems.value.filter(i => i.checked).length)
const totalCount = computed(() => shoppingListItems.value.length)

// 加载数据
onMounted(() => {
  loadShoppingList()
  loadTemplates()
  loadHistory()
})

const loadShoppingList = async () => {
  try {
    const res = await shoppingApi.get()
    if (res.data?.data) {
      currentListId.value = res.data.data.id
      if (res.data.data.items?.length > 0) {
        shoppingListItems.value = res.data.data.items
        return
      }
    }
  } catch (e) {
        // 错误处理
  }
  // 降级到本地存储
  if (savedList) {
    const parsed = JSON.parse(savedList)
    if (parsed.length > 0) {
      shoppingListItems.value = parsed
      return
    }
  }
  if (store.cart.length > 0) {
    shoppingListItems.value = store.cart
  }
}

const loadTemplates = async () => {
  try {
    const res = await templateApi.getAll()
    if (res.data?.data?.length > 0) {
      templates.value = [...templates.value, ...res.data.data]
    }
  } catch (e) {
        // 错误处理
  }
}

const loadHistory = async () => {
  try {
    const res = await historyApi.get()
    if (res.data?.data?.length > 0) {
      purchaseHistory.value = res.data.data.map(h => ({
        date: h.purchased_at.split('T')[0],
        items: h.items
      }))
    }
  } catch (e) {
        // 错误处理
  }

  // 计算常购食材
  const itemCount = {}
  purchaseHistory.value.forEach(record => {
    record.items.forEach(item => {
      itemCount[item] = (itemCount[item] || 0) + 1
    })
  })
  frequentItems.value = Object.entries(itemCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

const useTemplate = (template) => {
  shoppingListItems.value = template.items.map((name, index) => ({
    id: `template_${index}`,
    name,
    amount: '',
    checked: false
  }))
  activeTab.value = 'current'
}

const saveAsTemplate = () => {
  if (!newTemplateName.value.trim() || shoppingListItems.value.length === 0) return

  const newTemplate = {
    id: Date.now(),
    name: newTemplateName.value,
    icon: '📝',
    items: shoppingListItems.value.map(i => i.name)
  }

  const existing = saved ? JSON.parse(saved) : []
  existing.push(newTemplate)

  templates.value.push(newTemplate)
  newTemplateName.value = ''
  showSaveTemplate.value = false
}

const reuseHistory = (record) => {
  shoppingListItems.value = record.items.map((name, index) => ({
    id: `history_${index}`,
    name,
    amount: '',
    checked: false
  }))
  activeTab.value = 'current'
}

const handleUpdate = async (items) => {
  shoppingListItems.value = items
  // 保存到数据库，包含ID以更新现有清单
  try {
    const res = await shoppingApi.save({ id: currentListId.value, items })
    if (res.data?.data?.id) {
      currentListId.value = res.data.data.id
    }
  } catch (e) {
        // 错误处理
  }

  // 保存到本地存储作为备份

  // 保存到历史记录（当全部勾选时）
  if (items.length > 0 && items.every(i => i.checked)) {
    const today = new Date().toLocaleDateString('zh-CN')
    const historyItem = {
      date: today,
      items: items.map(i => i.name)
    }
    try {
      await historyApi.save(historyItem.items)
    } catch (e) {
          // 错误处理
    }
  }
}

const clearList = async () => {
  shoppingListItems.value = []
  try {
    await shoppingApi.save({ id: currentListId.value, items: [] })
  } catch (e) {
        // 错误处理
  }
}
</script>
