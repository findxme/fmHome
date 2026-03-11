<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <header class="bg-gradient-to-r from-accent-500 to-accent-600 text-white sticky top-0 z-30 pt-safe">
      <div class="max-w-4xl mx-auto px-4 pb-6">
        <h1 class="text-2xl font-bold">👨‍👩‍👧 家庭厨房</h1>
        <p class="text-white/80 text-sm mt-1">记录家的味道，传承爱的味道</p>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      <!-- 家庭成员 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span>👥</span> 家庭成员
          </h2>
          <button
            @click="showAddMember = true"
            class="text-accent-500 text-sm font-medium hover:text-accent-600 active:scale-95 transition-transform"
          >
            + 添加成员
          </button>
        </div>

        <div v-if="familyMembers.length === 0" class="text-center py-6">
          <div class="text-4xl mb-2">👥</div>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">还没有添加家庭成员</p>
          <button
            @click="showAddMember = true"
            class="px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium active:scale-95 transition-all"
          >
            添加第一个成员
          </button>
        </div>

        <div v-else class="flex gap-4 overflow-x-auto pb-2">
          <div
            v-for="member in familyMembers"
            :key="member.id"
            class="flex-shrink-0 text-center relative group"
          >
            <div
              class="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-transform hover:scale-110"
              :style="{ backgroundColor: member.color + '40' }"
            >
              {{ member.avatar }}
            </div>
            <p class="text-sm font-medium text-gray-800 dark:text-white">{{ member.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.title }}</p>

            <!-- 删除按钮 -->
            <button
              v-if="familyMembers.length > 1"
              @click="removeMember(member.id)"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 今日问候 -->
      <div class="bg-gradient-to-r from-accent-100 to-primary-100 dark:from-accent-900/30 dark:to-primary-900/30 rounded-2xl p-5">
        <p class="text-gray-700 dark:text-gray-200 text-center font-medium">
          {{ greeting }}
        </p>
      </div>

      <!-- 今日菜单 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span>📅</span> 今日菜单
          </h2>
          <button @click="$router.push('/')" class="text-accent-500 text-sm font-medium">
            去点餐 →
          </button>
        </div>

        <div v-if="todayMenu.length === 0" class="text-center py-8">
          <div class="text-5xl mb-3">🍽️</div>
          <p class="text-gray-500 dark:text-gray-400 mb-4">今天还没有安排菜单</p>
          <button @click="$router.push('/')" class="px-6 py-3 bg-accent-500 text-white rounded-xl font-medium">
            快速点餐
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(item, index) in todayMenu"
            :key="index"
            class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
          >
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-12">
              {{ item.meal }}
            </span>
            <span class="flex-1 font-medium text-gray-800 dark:text-white">{{ item.dish }}</span>
            <span
              v-if="item.cooker"
              class="text-xs px-3 py-1 rounded-full"
              :style="{ backgroundColor: getMemberColor(item.cooker) + '40', color: getMemberColor(item.cooker) }"
            >
              {{ getMemberName(item.cooker) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 快捷功能 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 添加菜品 -->
        <button
          @click="$router.push('/add-dish')"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left transition-all hover:shadow-md active:scale-98"
        >
          <div class="text-3xl mb-2">➕</div>
          <h3 class="font-medium text-gray-800 dark:text-white">添加菜品</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">分享你的拿手菜</p>
        </button>

        <!-- 做菜打卡 -->
        <button
          @click="showCheckin = true"
          class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm text-left transition-all hover:shadow-md active:scale-98"
        >
          <div class="text-3xl mb-2">📸</div>
          <h3 class="font-medium text-gray-800 dark:text-white">做菜打卡</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">记录今日家常</p>
        </button>
      </div>

      <!-- 做菜成就 -->
      <div class="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-5">
        <h2 class="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span>🏆</span> 做菜成就
        </h2>
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div
            v-for="badge in badges"
            :key="badge.id"
            class="flex-shrink-0 text-center"
          >
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 transition-transform hover:scale-110"
              :class="{ 'opacity-30 grayscale': !badge.earned }"
              :style="{ backgroundColor: badge.earned ? badge.color : 'transparent', border: badge.earned ? 'none' : '2px dashed #ddd' }"
            >
              {{ badge.icon }}
            </div>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ badge.name }}</p>
          </div>
        </div>
      </div>

      <!-- 今日待办 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <span>📋</span> 今日待办
          </h2>
          <button
            @click="showAddTodo = true"
            class="text-accent-500 text-sm font-medium hover:text-accent-600 active:scale-95 transition-transform"
          >
            + 添加
          </button>
        </div>

        <div v-if="todos.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
          <p>暂无待办事项</p>
          <p class="text-sm mt-1">点击上方按钮添加</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-all"
            :class="{ 'bg-green-50 dark:bg-green-900/20': todo.completed }"
          >
            <button
              @click="toggleTodo(todo.id)"
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all active:scale-90"
              :class="todo.completed ? 'bg-accent-500 border-accent-500' : 'border-gray-300 dark:border-gray-500'"
            >
              <svg v-if="todo.completed" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <span
              class="flex-1 text-gray-800 dark:text-white"
              :class="{ 'line-through text-gray-400': todo.completed }"
            >
              {{ todo.text }}
            </span>
            <span
              v-if="todo.cooker"
              class="text-xs px-2 py-1 rounded-full"
              :style="{ backgroundColor: getMemberColor(todo.cooker) + '40', color: getMemberColor(todo.cooker) }"
            >
              {{ getMemberName(todo.cooker) }}
            </span>
            <button
              @click="removeTodo(todo.id)"
              class="p-1 text-gray-400 hover:text-red-500 active:scale-90 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 连续打卡 -->
      <div class="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-5">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <span>🔥</span> 连续打卡
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ checkinStreak }} 天，继续保持！
            </p>
          </div>
          <button
            @click="doCheckin"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 active:scale-95 transition-all"
          >
            今日打卡
          </button>
        </div>
      </div>
    </div>

    <!-- 添加家庭成员弹窗 -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddMember" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showAddMember = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 mx-4 transition-all" @click.stop>
            <h3 class="font-semibold text-gray-800 dark:text-white mb-4 text-lg">添加家庭成员</h3>

            <!-- 头像选择 -->
            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">选择头像</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="avatar in avatars"
                  :key="avatar"
                  @click="newMember.avatar = avatar"
                  class="w-10 h-10 rounded-full text-xl transition-transform active:scale-90 hover:scale-110"
                  :class="newMember.avatar === avatar ? 'bg-accent-100 ring-2 ring-accent-500' : 'bg-gray-100'"
                >
                  {{ avatar }}
                </button>
              </div>
            </div>

            <!-- 名字 -->
            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">名字</label>
              <input
                v-model="newMember.name"
                type="text"
                placeholder="输入名字"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <!-- 称呼 -->
            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">称呼（选填）</label>
              <input
                v-model="newMember.title"
                type="text"
                placeholder="如：大厨、甜品师"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <div class="flex gap-3">
              <button
                @click="showAddMember = false"
                class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium active:scale-95 transition-all"
              >
                取消
              </button>
              <button
                @click="addMember"
                :disabled="!newMember.name"
                class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-medium disabled:opacity-50 active:scale-95 transition-all"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- 添加待办弹窗 -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddTodo" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="showAddTodo = false">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 mx-4 transition-all" @click.stop>
            <h3 class="font-semibold text-gray-800 dark:text-white mb-4 text-lg">添加待办</h3>

            <!-- 待办内容 -->
            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">事项内容</label>
              <input
                v-model="newTodo.text"
                type="text"
                placeholder="例如：买食材、做红烧肉"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              />
            </div>

            <!-- 指定成员 -->
            <div class="mb-4">
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-2">指定成员（选填）</label>
              <select
                v-model="newTodo.cooker"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:text-white"
              >
                <option :value="null">不指定</option>
                <option v-for="member in familyMembers" :key="member.id" :value="member.id">
                  {{ member.avatar }} {{ member.name }}
                </option>
              </select>
            </div>

            <div class="flex gap-3">
              <button
                @click="showAddTodo = false"
                class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium"
              >
                取消
              </button>
              <button
                @click="addTodo"
                :disabled="!newTodo.text"
                class="flex-1 py-3 bg-accent-500 text-white rounded-xl font-medium disabled:opacity-50 active:scale-95 transition-all"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

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
import { ref, reactive, computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { familyApi, todoApi, checkinApi } from '@/api'

// 问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '深夜还在，为美食做准备吗？'
  if (hour < 9) return '早上好！今天想吃点什么？'
  if (hour < 12) return '上午好！午餐想好了吗？'
  if (hour < 14) return '午安！下午继续加油~'
  if (hour < 18) return '下午好！晚餐可以开始准备了'
  return '晚上好！今天辛苦了'
})

// 头像选项（更年轻化）
const avatars = ['😎', '🤓', '🥳', '😊', '🙂', '🤩', '🧑', '👩', '👨', '🧔', '👱', '👩‍🦰', '👨‍🦱', '🧓', '👵', '👴']

// 颜色选项
const colors = ['#a7f3d0', '#bfdbfe', '#fecaca', '#bef264', '#fed7aa', '#ddd6fe', '#f9a8d4']

// 家庭成员
const familyMembers = ref([])

// 从API恢复家庭成员
onMounted(async () => {
  try {
    const res = await familyApi.get()
    if (res.data?.data?.members) {
      // 映射后端字段名到前端字段名
      familyMembers.value = res.data.data.members.map(m => ({
        id: m.id,
        name: m.member_name || m.name,
        title: m.title || '家庭成员',
        avatar: m.avatar || '😎',
        color: m.color || '#a7f3d0'
      }))
    }
  } catch (e) {
    // 加载失败
  }
})

// 保存到数据库
const saveMembers = async () => {
  try {
    // 保存所有成员到数据库
    for (const member of familyMembers.value) {
      await familyApi.addMember({
        name: member.name,
        title: member.title,
        avatar: member.avatar,
        color: member.color
      })
    }
  } catch (e) {
    // 错误处理
  }
}

// 获取成员名字
const getMemberName = (id) => {
  const member = familyMembers.value.find(m => m.id === id)
  return member ? member.name : ''
}

// 获取成员颜色
const getMemberColor = (id) => {
  const member = familyMembers.value.find(m => m.id === id)
  return member ? member.color : '#ddd'
}

// 添加成员弹窗
const showAddMember = ref(false)
const newMember = reactive({ name: '', title: '', avatar: '😎' })
const toast = ref({ show: false, message: '', icon: '' })

const showToast = (icon, message) => {
  toast.value = { show: true, icon, message }
  setTimeout(() => {
    toast.value.show = false
  }, 2000)
}

const addMember = async () => {
  if (newMember.name) {
    try {
      // 保存到数据库
      const res = await familyApi.addMember({
        name: newMember.name,
        title: newMember.title || '家庭成员',
        avatar: newMember.avatar,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
      // 使用后端返回的成员数据更新本地列表
      if (res.data?.members) {
        // 后端返回最新成员列表，取最后一个（刚添加的）
        const newMemberFromDb = res.data.members[res.data.members.length - 1]
        familyMembers.value.push({
          id: newMemberFromDb.id,
          name: newMemberFromDb.member_name,
          title: newMemberFromDb.title || '家庭成员',
          avatar: newMemberFromDb.avatar || '😎',
          color: newMemberFromDb.color || '#a7f3d0'
        })
      }
      showToast('✅', '成员添加成功')
    } catch (e) {
      // 即使API失败，也添加到本地
      const member = {
        id: uuidv4(),
        name: newMember.name,
        title: newMember.title || '家庭成员',
        avatar: newMember.avatar,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      familyMembers.value.push(member)
      showToast('⚠️', '已添加，稍后同步')
    }
    
    newMember.name = ''
    newMember.title = ''
    newMember.avatar = '😎'
    showAddMember.value = false
  }
}

const removeMember = async (id) => {
  try {
    // 从数据库删除
    await familyApi.removeMember(id)
    showToast('🗑️', '成员已移除')
  } catch (e) {
    // 即使API失败，也从本地移除
    showToast('⚠️', '已移除，稍后同步')
  }
  // 从本地列表移除
  familyMembers.value = familyMembers.value.filter(m => m.id !== id)
}

// 今日菜单（示例数据）
const todayMenu = ref([
  { meal: '早餐', dish: '葱油拌面', cooker: null },
  { meal: '午餐', dish: '红烧肉', cooker: null }
])

// 做菜成就
const badges = ref([
  { id: 1, name: '新手入门', icon: '🌟', earned: true, color: '#fef08a' },
  { id: 2, name: '一周主厨', icon: '👨‍🍳', earned: true, color: '#fef08a' },
  { id: 3, name: '十道硬菜', icon: '🍖', earned: false, color: '#ddd' },
  { id: 4, name: '甜品达人', icon: '🍰', earned: false, color: '#ddd' },
  { id: 5, name: '家庭煮神', icon: '🏆', earned: false, color: 'gold' }
])

// 待办事项
const todos = ref([])
onMounted(async () => {
  try {
    const res = await todoApi.getAll()
    if (res.data?.data) {
      todos.value = res.data.data.map(t => ({
        id: t.id,
        text: t.content,
        completed: t.completed,
        createdAt: t.created_at
      }))
    }
  } catch (e) {
        // 错误处理
  }
})

const saveTodos = async () => {
  // 已实时保存到数据库
}

const showAddTodo = ref(false)
const newTodo = reactive({ text: '', cooker: null })

const addTodo = async () => {
  if (newTodo.text) {
    try {
      const res = await todoApi.add(newTodo.text)
      if (res.data?.data) {
        todos.value.unshift({
          id: res.data.data.id,
          text: res.data.data.content,
          completed: res.data.data.completed,
          createdAt: res.data.data.created_at
        })
      }
    } catch (e) {
          // 错误处理
    }
    newTodo.text = ''
    newTodo.cooker = null
    showAddTodo.value = false
    showToast('✅', '待办已添加')
  }
}

const toggleTodo = async (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    try {
      await todoApi.update(id, { content: todo.text, completed: !todo.completed })
      todo.completed = !todo.completed
      if (todo.completed) {
        showToast('🎉', '完成一项！')
      }
    } catch (e) {
          // 错误处理
    }
  }
}

const removeTodo = async (id) => {
  try {
    await todoApi.delete(id)
    todos.value = todos.value.filter(t => t.id !== id)
    showToast('🗑️', '已删除')
  } catch (e) {
        // 错误处理
  }
}

// 连续打卡
const checkinStreak = ref(0)
const lastCheckinDate = ref('')
onMounted(async () => {
  try {
    const res = await checkinApi.get()
    if (res.data?.data) {
      checkinStreak.value = res.data.data.streak || 0
      lastCheckinDate.value = res.data.data.last_date || ''
    }
  } catch (e) {
    // 加载打卡数据失败
  }
})

const doCheckin = async () => {
  const today = new Date().toDateString()

  if (lastCheckinDate.value !== today) {
    checkinStreak.value++
    try { await checkinApi.checkin(); } catch(e) { }
    showToast('🎊', `连续打卡 ${checkinStreak.value} 天！`)

    // 解锁成就
    if (checkinStreak.value >= 7) {
      badges.value[1].earned = true
      badges.value[1].color = '#a7f3d0'
    }
  } else {
    showToast('ℹ️', '今日已打卡')
  }
}

// 打卡弹窗
const showCheckin = ref(false)
</script>
