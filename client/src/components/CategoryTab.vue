<template>
  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="cat in categories"
      :key="cat"
      @click="$emit('select', cat)"
      class="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all"
      :class="selected === cat
        ? 'bg-primary-500 text-white shadow-md'
        : 'bg-white text-gray-600 hover:bg-gray-100'"
    >
      {{ cat }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  selected: {
    type: String,
    default: ''
  }
})

defineEmits(['select'])
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
