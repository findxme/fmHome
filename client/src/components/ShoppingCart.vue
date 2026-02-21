<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
    <div class="max-w-4xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="count > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ count }}
            </span>
          </div>
          <div>
            <span class="font-medium text-gray-800">已选 {{ count }} 道菜</span>
            <span class="text-gray-500 ml-2" v-if="totalPrice">¥{{ totalPrice }}</span>
          </div>
        </div>
        <button
          @click="$emit('checkout')"
          :disabled="count === 0"
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          生成购物清单
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  }
})

defineEmits(['checkout'])
</script>
