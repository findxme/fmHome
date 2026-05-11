<template>
  <nav class="fixed bottom-0 left-0 right-0 glass-effect border-t border-primary/10 px-4 py-3 z-40">
    <div class="flex items-center justify-around">
      <button
        v-for="item in tabs"
        :key="item.path"
        @click="goTo(item.path)"
        class="flex flex-col items-center py-2 px-5 rounded-xl transition-all duration-300 bright-button"
        :class="currentPath === item.path ? 'gradient-primary text-white shadow-bright' : 'text-gray-600 hover:text-primary'"
      >
        <svg :class="['w-6 h-6 transition-all duration-300', currentPath === item.path ? 'scale-110' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path :d="item.icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </svg>
        <span class="text-xs mt-1">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const currentPath = ref('/');

const tabs = [
  { path: '/', label: '首页', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/recipes', label: '菜谱', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { path: '/favorites', label: '收藏', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { path: '/ledger', label: '记账', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
];

function goTo(path) {
  if (currentPath.value !== path) {
    router.push(path);
  }
}

function updateCurrentPath() {
  currentPath.value = route.path;
}

onMounted(() => {
  updateCurrentPath();
  router.afterEach(updateCurrentPath);
});
</script>