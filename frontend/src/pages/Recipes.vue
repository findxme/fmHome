<template>
  <div class="min-h-screen pb-20 relative bg-white">
    <transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg"
        :class="toast.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
      >
        <div class="flex items-center gap-2">
          <svg v-if="toast.success" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="text-sm font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </transition>

    <header class="glass-effect px-4 py-6 sticky top-0 z-10 border-b border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="status-dot status-active"></div>
          <h1 class="text-xl font-bold text-gradient tracking-wide">菜谱库</h1>
        </div>
        <button @click="goToForm" class="px-5 py-2 gradient-primary text-white text-sm rounded-lg bright-button">
          + 新建
        </button>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="setFilter(filter.value)"
          class="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all bright-button"
          :class="currentFilter === filter.value ? 'gradient-primary text-white border-transparent' : 'glass-effect-light text-dark hover:text-primary border-gray-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </header>

    <div class="px-4 py-4">
      <div v-if="recipes.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-primary/20 flex items-center justify-center">
          <svg class="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <p class="text-secondary text-sm mb-4">还没有菜谱</p>
        <button @click="goToForm" class="px-6 py-3 gradient-primary text-white rounded-lg bright-button">
          创建第一个菜谱
        </button>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="recipe in recipes"
          :key="recipe.id"
          class="glass-effect rounded-2xl overflow-hidden card-hover"
        >
          <div class="relative h-32" @click="goToDetail(recipe.id)">
            <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover cursor-pointer"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 glass-effect-light text-xs rounded-lg text-primary">{{ recipe.category }}</span>
            </div>
            <div class="absolute top-3 right-3 flex gap-2">
              <button
                @click.stop="toggleFavorite(recipe)"
                class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-all"
              >
                <svg v-if="favoriteStore.isFavorite(recipe.id)" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <button
                @click.stop="addToMenu(recipe)"
                class="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-all"
              >
                <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold truncate text-dark mb-2 cursor-pointer" @click="goToDetail(recipe.id)">{{ recipe.title }}</h3>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-secondary">{{ recipe.cookTime }}</span>
              <span class="text-xs px-2 py-1 rounded-lg" :class="getDifficultyClass(recipe.difficulty)">
                {{ recipe.difficulty }}
              </span>
            </div>
            <div class="flex gap-1 flex-wrap">
              <span
                v-for="tag in (recipe.tags || []).slice(0, 2)"
                :key="tag"
                class="text-xs text-accent"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRecipeStore } from '../stores/recipes.js';
import { useMealPickStore } from '../stores/mealPicks.js';
import { useFavoriteStore } from '../stores/favorites.js';

const router = useRouter();
const recipeStore = useRecipeStore();
const mealPickStore = useMealPickStore();
const favoriteStore = useFavoriteStore();

const currentFilter = ref('');
const toast = ref({ show: false, message: '', success: true });

const filters = [
  { label: '全部', value: '' },
  { label: '快手菜', value: 'quick' },
  { label: '汤类', value: 'soup' },
  { label: '素菜', value: 'vegetable' },
  { label: '下饭菜', value: 'rice-killer' }
];

const recipes = computed(() => recipeStore.list);

function showToast(message, success = true) {
  toast.value = { show: true, message, success };
  setTimeout(() => {
    toast.value.show = false;
  }, 2000);
}

async function addToMenu(recipe) {
  const result = await mealPickStore.addMealPick(recipe.id, recipe.title);
  if (!result.success) {
    showToast(result.message, false);
  } else {
    showToast('已加入今日菜单');
  }
}

async function toggleFavorite(recipe) {
  if (favoriteStore.isFavorite(recipe.id)) {
    const result = await favoriteStore.removeFavorite(recipe.id);
    if (result.success) {
      showToast('已取消收藏');
    }
  } else {
    const result = await favoriteStore.addFavorite(recipe.id, recipe.title);
    if (result.success) {
      showToast('已收藏');
    } else {
      showToast(result.message, false);
    }
  }
}

function getDifficultyClass(difficulty) {
  const classes = {
    '简单': 'badge-success',
    '中等': 'badge-gradient',
    '困难': 'badge-warning'
  };
  return classes[difficulty] || 'glass-effect-light text-secondary';
}

function getDifficultyStatus(difficulty) {
  const statuses = {
    '简单': 'status-active',
    '中等': 'status-pending',
    '困难': 'status-completed'
  };
  return statuses[difficulty] || 'status-pending';
}

function setFilter(filter) {
  currentFilter.value = filter;
}

function goToDetail(id) {
  router.push(`/recipe/${id}`);
}

function goToForm() {
  router.push('/recipe-form');
}

onMounted(() => {
  recipeStore.fetchRecipes();
  favoriteStore.fetchFavorites();
});
</script>

<style scoped>
.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}
.toast-leave-active {
  animation: toastOut 0.3s ease-in;
}
@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}
</style>