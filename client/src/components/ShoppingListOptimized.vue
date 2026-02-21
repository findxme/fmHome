<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
    <!-- 清单头部 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <span>🛒</span> 购物清单
      </h3>
      <span class="text-sm text-gray-500">
        {{ checkedCount }}/{{ totalCount }} 已采购
      </span>
    </div>

    <!-- 手动添加食材 -->
    <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
      <div class="flex gap-2">
        <input
          v-model="newIngredient.name"
          type="text"
          placeholder="添加食材..."
          class="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
          @keyup.enter="addIngredient"
        />
        <input
          v-model="newIngredient.amount"
          type="text"
          placeholder="用量"
          class="w-20 px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white text-sm"
        />
        <button
          @click="addIngredient"
          class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium active:scale-95 transition-all"
        >
          添加
        </button>
      </div>
    </div>

    <!-- 按采购地点分组 -->
    <div v-for="(items, location) in groupedItems" :key="location" class="mb-4">
      <h4 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
        <span>{{ getLocationIcon(location) }}</span>
        {{ location }}
      </h4>
      <div class="space-y-1">
        <div
          v-for="item in items"
          :key="item.key"
          class="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :class="{ 'bg-green-50 dark:bg-green-900/20': item.checked }"
        >
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              v-model="item.checked"
              @change="updateItem(item)"
              class="w-5 h-5 rounded border-gray-300 text-accent-500 focus:ring-accent-500"
            />
            <div class="flex-1" @click="openEditModal(item)">
              <span :class="{ 'line-through text-gray-400': item.checked }" class="text-gray-800 dark:text-white font-medium">
                {{ item.name }}
              </span>
              <span class="text-gray-500 text-sm ml-2">{{ item.amount }}</span>
              <span
                v-if="item.note"
                class="text-xs ml-2 px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded"
              >
                {{ item.note }}
              </span>
            </div>
            <button
              @click="removeIngredient(item)"
              class="p-1 text-gray-400 hover:text-red-500"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="totalCount === 0" class="text-center py-8">
      <div class="text-4xl mb-2">📝</div>
      <p class="text-gray-500 dark:text-gray-400 text-sm">购物清单为空</p>
      <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">添加食材或从购物车生成</p>
    </div>

    <!-- 操作按钮 -->
    <div v-else class="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button
        @click="shareList"
        class="flex-1 py-2.5 px-4 bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all active:scale-95"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        分享
      </button>
      <button
        @click="copyList"
        class="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 text-gray-700 dark:text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-all active:scale-95"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        复制
      </button>
      <button
        @click="clearAll"
        class="py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30 text-red-500 hover:text-red-600 rounded-xl text-sm font-medium transition-all active:scale-95"
      >
        清空
      </button>
    </div>

    <!-- 编辑弹窗 -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closeEditModal">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 mx-4 transition-all" @click.stop>
            <h3 class="font-semibold text-gray-800 dark:text-white mb-4 text-lg">编辑食材</h3>

            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">名称</label>
              <input
                v-model="editItem.name"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">用量</label>
              <input
                v-model="editItem.amount"
                type="text"
                placeholder="如：500g、适量"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">备注</label>
              <input
                v-model="editItem.note"
                type="text"
                placeholder="如：买少点、不用买"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="closeEditModal"
                class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                @click="saveEditItem"
                class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-medium active:scale-95 transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Toast -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="toast.show" class="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
        <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-full shadow-lg">
          <span>{{ toast.icon }}</span>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  cartItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update', 'clear'])

// Toast
const toast = ref({ show: false, icon: '', message: '' })
const showToastFn = (icon, message) => {
  toast.value = { show: true, icon, message }
  setTimeout(() => { toast.value.show = false }, 2000)
}

// 手动添加
const newIngredient = ref({ name: '', amount: '' })

// 编辑弹窗
const showEditModal = ref(false)
const editItem = ref({ key: '', name: '', amount: '', note: '' })

// 采购地点分组
const locationGroups = {
  '菜市场': ['肉类', '海鲜', '蔬菜', '禽类', '牛肉', '猪肉', '鸡肉', '水产', '鱼', '虾'],
  '超市': ['蛋类', '豆制品', '主食', '干货', '奶制品', '速冻', '饮料', '牛奶', '酸奶'],
  '调料店': ['调料', '香料', '调味品', '酱料', '食用油', '盐', '糖', '酱油']
}

const getLocationIcon = (location) => {
  const icons = { '菜市场': '🥬', '超市': '🛒', '调料店': '🧂', '其他': '📦' }
  return icons[location] || '📍'
}

// 内部食材列表
const internalItems = ref([])

// 同步外部数据
watch(() => props.cartItems, (newItems) => {
  // 合并外部数据到内部列表
  newItems.forEach(dish => {
    if (dish.ingredients && Array.isArray(dish.ingredients)) {
      dish.ingredients.forEach(ing => {
        const name = typeof ing === 'string' ? ing : (ing.name || '')
        const amount = typeof ing === 'string' ? '' : (ing.amount || '')
        if (name && !internalItems.value.find(i => i.key === name && i.source === dish.id)) {
          internalItems.value.push({
            key: name,
            name: name,
            amount: amount,
            category: '其他',
            checked: false,
            note: '',
            source: dish.id
          })
        }
      })
    }
  })
}, { immediate: true, deep: true })

// 添加食材
const addIngredient = () => {
  if (newIngredient.value.name.trim()) {
    const key = newIngredient.value.name.trim()
    const existing = internalItems.value.find(i => i.key === key)

    if (existing) {
      showToastFn('ℹ️', '食材已存在')
    } else {
      internalItems.value.push({
        key,
        name: key,
        amount: newIngredient.value.amount || '适量',
        category: '其他',
        checked: false,
        note: '',
        source: 'manual'
      })
      showToastFn('✅', '添加成功')
    }

    newIngredient.value = { name: '', amount: '' }
    emit('update', internalItems.value)
  }
}

// 移除食材
const removeIngredient = (item) => {
  internalItems.value = internalItems.value.filter(i => i.key !== item.key)
  emit('update', internalItems.value)
  showToastFn('🗑️', '已删除')
}

// 打开编辑弹窗
const openEditModal = (item) => {
  editItem.value = { ...item }
  showEditModal.value = true
}

// 关闭编辑弹窗
const closeEditModal = () => {
  showEditModal.value = false
}

// 保存编辑
const saveEditItem = () => {
  const index = internalItems.value.findIndex(i => i.key === editItem.value.key)
  if (index !== -1) {
    internalItems.value[index] = {
      ...internalItems.value[index],
      name: editItem.value.name,
      amount: editItem.value.amount,
      note: editItem.value.note
    }
    emit('update', internalItems.value)
    showToastFn('✅', '保存成功')
  }
  closeEditModal()
}

// 计算分组
const groupedItems = computed(() => {
  const groups = { '菜市场': [], '超市': [], '调料店': [], '其他': [] }

  internalItems.value.forEach(ing => {
    let assigned = false

    for (const [location, keywords] of Object.entries(locationGroups)) {
      const match = keywords.some(kw =>
        ing.category?.includes(kw) || ing.name.includes(kw)
      )
      if (match) {
        groups[location].push(ing)
        assigned = true
        break
      }
    }

    if (!assigned) {
      groups['其他'].push(ing)
    }
  })

  // 移除空分组
  for (const location of Object.keys(groups)) {
    if (groups[location].length === 0) {
      delete groups[location]
    }
  }

  return groups
})

const totalCount = computed(() => internalItems.value.length)
const checkedCount = computed(() => internalItems.value.filter(i => i.checked).length)

const updateItem = (item) => {
  localStorage.setItem(`shopping_item_${item.key}`, item.checked)
  emit('update', internalItems.value)
}

const shareList = () => {
  const text = Object.entries(groupedItems.value)
    .map(([location, items]) => {
      const header = `\n📍 ${location}`
      const list = items.map(item =>
        `${item.checked ? '✅' : '☐'} ${item.name} ${item.amount}${item.note ? ` (${item.note})` : ''}`
      ).join('\n')
      return header + list
    })
    .join('\n')

  if (navigator.share) {
    navigator.share({ title: '家庭购物清单', text })
  } else {
    navigator.clipboard.writeText(text)
    showToastFn('✅', '已复制到剪贴板')
  }
}

const copyList = () => {
  const text = Object.entries(groupedItems.value)
    .map(([location, items]) => {
      const header = `${getLocationIcon(location)} ${location}`
      const list = items.map(item =>
        `${item.checked ? '✅' : '☐'} ${item.name} ${item.amount}${item.note ? ` (${item.note})` : ''}`
      ).join('\n')
      return `${header}\n${list}`
    })
    .join('\n\n')

  navigator.clipboard.writeText(text)
  showToastFn('✅', '清单已复制')
}

const clearAll = () => {
  if (confirm('确定清空购物清单吗？')) {
    internalItems.value = []
    emit('clear')
    showToastFn('🗑️', '清单已清空')
  }
}
</script>
