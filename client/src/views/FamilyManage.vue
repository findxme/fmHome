<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部 -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 pt-12">
      <h1 class="text-2xl font-bold mb-2">👨‍👩‍👧‍👦 家庭厨房</h1>
      <p class="text-blue-100">和家人一起分享美食的乐趣</p>
    </div>

    <!-- 未创建家庭 -->
    <div v-if="!family" class="p-6">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
        <p class="text-6xl mb-4">🏠</p>
        <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-2">创建你的家庭</h2>
        <p class="text-gray-500 mb-6">创建一个家庭，邀请家人一起分享菜谱、菜单计划和烹饪乐趣</p>

        <div class="space-y-3">
          <input
            v-model="familyName"
            type="text"
            placeholder="输入家庭名称"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
          />
          <button
            @click="createFamily"
            :disabled="!familyName || isCreating"
            class="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {{ isCreating ? '创建中...' : '✨ 创建家庭' }}
          </button>
        </div>

        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p class="text-gray-500 mb-3">已有家庭？输入邀请码加入</p>
          <div class="space-y-3">
            <input
              v-model="joinCode"
              type="text"
              placeholder="输入6位邀请码"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white uppercase"
              maxlength="6"
            />
            <input
              v-model="memberName"
              type="text"
              placeholder="你的昵称"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white"
            />
            <button
              @click="joinFamily"
              :disabled="!joinCode || !memberName || isJoining"
              class="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
            >
              {{ isJoining ? '加入中...' : '🔗 加入家庭' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 已创建家庭 -->
    <div v-else class="p-4">
      <!-- 家庭信息 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">{{ family.name }}</h2>
            <p class="text-sm text-gray-500">家庭成员: {{ family.members?.length || 0 }}人</p>
          </div>
          <button
            @click="refreshCode"
            class="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
          >
            🔄 刷新邀请码
          </button>
        </div>

        <!-- 邀请码 -->
        <div class="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-500">邀请码</p>
            <p class="text-2xl font-mono font-bold text-gray-800 dark:text-white tracking-widest">
              {{ family.invite_code || '------' }}
            </p>
          </div>
          <button
            @click="copyCode"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            📋 复制
          </button>
        </div>
      </div>

      <!-- 家庭成员 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4">
        <h3 class="font-semibold text-gray-800 dark:text-white mb-4">👥 家庭成员</h3>
        <div class="space-y-3">
          <div
            v-for="member in family.members"
            :key="member.id"
            class="flex items-center justify-between py-2"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                {{ member.member_name.charAt(0) }}
              </div>
              <div>
                <p class="font-medium text-gray-800 dark:text-white">{{ member.member_name }}</p>
                <p class="text-xs text-gray-500">{{ member.role === 'admin' ? '管理员' : '成员' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="$router.push('/achievements')"
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-left"
        >
          <p class="text-2xl mb-2">🏆</p>
          <p class="font-semibold text-gray-800 dark:text-white">成就</p>
          <p class="text-xs text-gray-500">查看成就进度</p>
        </button>
        <button
          @click="$router.push('/menu')"
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm text-left"
        >
          <p class="text-2xl mb-2">📅</p>
          <p class="font-semibold text-gray-800 dark:text-white">菜单计划</p>
          <p class="text-xs text-gray-500">规划每周菜单</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { familyApi } from '@/api'

const family = ref(null)
const familyName = ref('')
const joinCode = ref('')
const memberName = ref('')
const isCreating = ref(false)
const isJoining = ref(false)

onMounted(async () => {
  await loadFamily()
})

const loadFamily = async () => {
  try {
    const res = await familyApi.get()
    if (res.data.success) {
      family.value = res.data.data
    }
  } catch (e) {
        // 错误处理
  }
}

const createFamily = async () => {
  if (!familyName.value) return

  isCreating.value = true
  try {
    const res = await familyApi.create(familyName.value)
    if (res.data.success) {
      family.value = res.data.family
      family.value.members = res.data.members
    } else {
      alert(res.data.error || '创建失败')
    }
  } catch (e) {
        // 错误处理
    alert('创建失败，请重试')
  }
  isCreating.value = false
}

const joinFamily = async () => {
  if (!joinCode.value || !memberName.value) return

  isJoining.value = true
  try {
    const res = await familyApi.join(joinCode.value.toUpperCase(), memberName.value)
    if (res.data.success) {
      family.value = res.data.family
      family.value.members = res.data.members
    } else {
      alert(res.data.error || '加入失败')
    }
  } catch (e) {
        // 错误处理
    alert('加入失败，请重试')
  }
  isJoining.value = false
}

const refreshCode = async () => {
  try {
    const res = await familyApi.refreshCode()
    if (res.data.success) {
      family.value.invite_code = res.data.invite_code
    }
  } catch (e) {
        // 错误处理
  }
}

const copyCode = () => {
  if (family.value?.invite_code) {
    navigator.clipboard.writeText(family.value.invite_code)
    alert('邀请码已复制到剪贴板')
  }
}
</script>
