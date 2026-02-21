<template>
  <div class="fixed bottom-6 right-6 z-40">
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
          <h3 class="font-semibold">AI 助手</h3>
          <p class="text-sm opacity-90">智能推荐菜品、规划菜单</p>
        </div>

        <div class="p-4 space-y-3 max-h-64 overflow-y-auto">
          <button
            v-for="feature in features"
            :key="feature.id"
            @click="$emit('select', feature.id)"
            class="w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
          >
            <span class="text-2xl">{{ feature.icon }}</span>
            <div>
              <div class="font-medium text-gray-800">{{ feature.title }}</div>
              <div class="text-xs text-gray-500">{{ feature.desc }}</div>
            </div>
          </button>
        </div>

        <div class="p-3 border-t bg-gray-50">
          <button
            @click="$router.push('/ai-assistant')"
            class="w-full btn-primary text-sm"
          >
            打开AI助手
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const features = [
  { id: 'recommend', icon: '🍽️', title: '今日推荐', desc: '根据口味推荐菜品' },
  { id: 'plan', icon: '📅', title: '菜单规划', desc: '智能规划一周菜单' },
  { id: 'chat', icon: '💬', title: '烹饪问答', desc: '解答烹饪疑问' }
]

defineEmits(['select'])
</script>
