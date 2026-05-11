<template>
  <div class="min-h-screen pb-20 relative bg-white">
    <header class="glass-effect px-4 py-6 sticky top-0 z-10 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="status-dot status-active"></div>
        <h1 class="text-xl font-bold text-gradient tracking-wide">我的收藏</h1>
      </div>
    </header>

    <div class="px-4 py-4">
      <div v-if="favorites.length === 0" class="text-center py-16">
        <div class="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-red-400/20 flex items-center justify-center">
          <svg class="w-12 h-12 text-red-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <p class="text-secondary text-sm mb-4">还没有收藏任何菜谱</p>
        <button @click="goToRecipes" class="px-6 py-3 gradient-primary text-white rounded-lg bright-button">
          去收藏喜欢的菜谱
        </button>
      </div>

      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="fav in favorites"
          :key="fav.id"
          class="glass-effect rounded-2xl overflow-hidden card-hover"
        >
          <div class="relative h-32" @click="goToDetail(fav.recipeId)">
            <img :src="fav.imageUrl" :alt="fav.recipeTitle" class="w-full h-full object-cover cursor-pointer"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-3 py-1 glass-effect-light text-xs rounded-lg text-primary">{{ fav.category }}</span>
            </div>
            <button
              @click.stop="removeFavorite(fav.recipeId)"
              class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-all"
            >
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          <div class="p-4">
            <h3 class="font-semibold truncate text-dark mb-2 cursor-pointer" @click="goToDetail(fav.recipeId)">{{ fav.recipeTitle }}</h3>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs text-secondary">{{ fav.cookTime }}</span>
              <span class="text-xs px-2 py-1 rounded-lg" :class="getDifficultyClass(fav.difficulty)">
                {{ fav.difficulty }}
              </span>
            </div>
            <div class="flex gap-1 flex-wrap">
              <span
                v-for="tag in (fav.tags || []).slice(0, 2)"
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
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFavoriteStore } from '../stores/favorites.js';

const router = useRouter();
const favoriteStore = useFavoriteStore();

const favorites = computed(() => favoriteStore.favorites);

function getDifficultyClass(difficulty) {
  const classes = {
    '简单': 'badge-success',
    '中等': 'badge-gradient',
    '困难': 'badge-warning'
  };
  return classes[difficulty] || 'glass-effect-light text-secondary';
}

async function removeFavorite(recipeId) {
  await favoriteStore.removeFavorite(recipeId);
}

function goToDetail(id) {
  router.push(`/recipe/${id}`);
}

function goToRecipes() {
  router.push('/recipes');
}

onMounted(() => {
  favoriteStore.fetchFavorites();
});
</script>