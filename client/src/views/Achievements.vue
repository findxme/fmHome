<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部 -->
    <div class="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 pt-12">
      <h1 class="text-2xl font-bold mb-2">🏆 成就系统</h1>
      <p class="text-amber-100">记录你的厨艺进阶之路</p>
    </div>

    <!-- 等级进度 -->
    <div class="p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl">
            {{ levelIcon }}
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ levelName }}</h3>
            <p class="text-sm text-gray-500">经验值: {{ userLevel?.experience_points || 0 }}</p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-bold text-amber-500">{{ userLevel?.level || 1 }}</p>
            <p class="text-xs text-gray-400">等级</p>
          </div>
        </div>

        <!-- 进度条 -->
        <div class="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-center">
          {{ userLevel?.total_cooks || 0 }} 次烹饪 / {{ nextLevelExp }} 经验值
        </p>
      </div>
    </div>

    <!-- 统计 -->
    <div class="p-4 pt-0">
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
          <p class="text-2xl mb-1">🔥</p>
          <p class="text-lg font-bold text-gray-800 dark:text-white">{{ userLevel?.consecutive_days || 0 }}</p>
          <p class="text-xs text-gray-500">连续天数</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
          <p class="text-2xl mb-1">🍳</p>
          <p class="text-lg font-bold text-gray-800 dark:text-white">{{ userLevel?.total_cooks || 0 }}</p>
          <p class="text-xs text-gray-500">总烹饪</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-3 text-center">
          <p class="text-2xl mb-1">🏅</p>
          <p class="text-lg font-bold text-gray-800 dark:text-white">{{ unlockedCount }}</p>
          <p class="text-xs text-gray-500">已解锁</p>
        </div>
      </div>
    </div>

    <!-- 成就列表 -->
    <div class="p-4 pt-0">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">成就徽章</h2>

      <div class="space-y-3">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4"
          :class="{ 'opacity-60': !achievement.is_unlocked }"
        >
          <!-- 图标 -->
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            :class="achievement.is_unlocked
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'"
          >
            {{ achievement.icon }}
          </div>

          <!-- 信息 -->
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800 dark:text-white">{{ achievement.name }}</h3>
            <p class="text-sm text-gray-500">{{ achievement.description }}</p>

            <!-- 进度条 -->
            <div v-if="!achievement.is_unlocked" class="mt-2">
              <div class="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-amber-500 transition-all"
                  :style="{ width: (achievement.progress / achievement.requirement * 100) + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-400 mt-1">{{ achievement.progress }} / {{ achievement.requirement }}</p>
            </div>
          </div>

          <!-- 解锁标识 -->
          <div v-if="achievement.is_unlocked" class="text-green-500 text-2xl">✅</div>
        </div>
      </div>
    </div>

    <!-- 检查新成就按钮 -->
    <div class="p-4 pt-0">
      <button
        @click="checkAchievements"
        :disabled="isChecking"
        class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform"
      >
        {{ isChecking ? '检查中...' : '🔍 检查新成就' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { achievementsApi } from '@/api'
import ConfettiCelebration from '@/components/ConfettiCelebration.vue'

const achievements = ref([])
const userLevel = ref(null)
const isChecking = ref(false)
const showConfetti = ref(false)
const newAchievements = ref([])

const levelNames = ['新手', '初学者', '小厨师', '厨房老手', '烹饪达人', '厨神']
const levelIcons = ['🌱', '🍳', '👨‍🍳', '🏅', '🥇', '👑']

const levelName = computed(() => levelNames[(userLevel.value?.level || 1) - 1])
const levelIcon = computed(() => levelIcons[(userLevel.value?.level || 1) - 1])

const unlockedCount = computed(() => achievements.value.filter(a => a.is_unlocked).length)

const nextLevelExp = computed(() => {
  const level = userLevel.value?.level || 1
  const expMap = { 1: 50, 2: 150, 3: 300, 4: 500, 5: 800, 6: 1000 }
  return expMap[level] || 100
})

const progressPercent = computed(() => {
  const exp = userLevel.value?.experience_points || 0
  const level = userLevel.value?.level || 1
  const currentLevelExp = level === 1 ? 0 : (level - 1) * 100
  const nextLevelExpValue = nextLevelExp.value
  return Math.min(100, ((exp - currentLevelExp) / (nextLevelExpValue - currentLevelExp)) * 100)
})

onMounted(async () => {
  await loadAchievements()
})

const loadAchievements = async () => {
  try {
    const res = await achievementsApi.getMy()
    if (res.data.success) {
      achievements.value = res.data.data.achievements || []
      userLevel.value = res.data.data.level
    }
  } catch (e) {
        // 错误处理
  }
}

const checkAchievements = async () => {
  isChecking.value = true

  try {
    const res = await achievementsApi.check()
    if (res.data.success && res.data.newlyUnlocked?.length > 0) {
      newAchievements.value = res.data.newlyUnlocked
      showConfetti.value = true
      setTimeout(() => {
        showConfetti.value = false
      }, 3000)
    }

    // 重新加载成就
    await loadAchievements()
  } catch (e) {
        // 错误处理
  }

  isChecking.value = false
}
</script>
