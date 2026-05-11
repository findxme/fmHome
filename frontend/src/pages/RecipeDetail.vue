<template>
  <div class="min-h-screen pb-24 relative">
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
    <div v-if="recipe" class="relative">
      <div class="h-72 relative overflow-hidden">
        <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-full object-cover"/>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/40 to-transparent"></div>
        <button @click="goBack" class="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button @click="toggleFavorite" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-all">
          <svg v-if="isFavorite" class="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <svg v-else class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <div class="absolute bottom-6 left-4 right-4 text-white">
          <div class="flex items-center gap-2 mb-3">
            <div class="status-dot" :class="getDifficultyStatus(recipe.difficulty)"></div>
            <span class="text-xs">{{ recipe.difficulty }}</span>
          </div>
          <h1 class="text-2xl font-bold mb-2">{{ recipe.title }}</h1>
          <div class="flex items-center gap-4">
            <span class="px-3 py-1 glass-effect-light rounded-lg text-sm">{{ recipe.category }}</span>
            <span class="text-sm">{{ recipe.cookTime }}</span>
          </div>
        </div>
      </div>

      <div class="px-4 py-4 -mt-4 relative">
        <div class="glass-effect rounded-2xl p-5 border-gradient-success">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-success"></div>
              <h2 class="font-semibold text-lg tracking-wide text-dark">食材清单</h2>
            </div>
            <button @click="addMainToShoppingList" class="px-3 py-1 text-xs gradient-success text-white rounded-lg bright-button">
              添加主食材到购物清单
            </button>
          </div>
          <div v-if="mainIngredients.length > 0" class="mb-4">
            <p class="text-xs text-secondary mb-2">主食材</p>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="(ingredient, index) in mainIngredients"
                :key="index"
                class="flex items-center gap-3 p-3 rounded-xl glass-effect-light card-hover"
              >
                <div class="w-10 h-10 rounded-lg gradient-success flex items-center justify-center shadow-bright">
                  <span class="text-xs text-white font-bold">{{ index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-dark font-medium text-sm">{{ ingredient.name }}</p>
                  <p class="text-xs text-secondary">{{ ingredient.amount }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="otherIngredients.length > 0">
            <p class="text-xs text-secondary mb-2">配料/调料</p>
            <div class="grid grid-cols-2 gap-3">
              <div
                v-for="(ingredient, index) in otherIngredients"
                :key="index"
                class="flex items-center gap-3 p-3 rounded-xl glass-effect-light card-hover"
              >
                <div class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <span class="text-xs text-gray-500 font-bold">{{ mainIngredients.length + index + 1 }}</span>
                </div>
                <div class="flex-1">
                  <p class="text-dark font-medium text-sm">{{ ingredient.name }}</p>
                  <p class="text-xs text-secondary">{{ ingredient.amount }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2">
        <div class="glass-effect rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-primary"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">烹饪步骤</h2>
          </div>
          <div class="space-y-4">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex gap-4"
            >
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-bright">
                  <span class="text-white font-bold">{{ index + 1 }}</span>
                </div>
                <div v-if="index < steps.length - 1" class="w-0.5 h-full bg-primary/30 mt-2"></div>
              </div>
              <div class="flex-1 glass-effect-light rounded-xl p-4">
                <p class="text-dark leading-relaxed">{{ step.content }}</p>
                <div v-if="step.imageUrl" class="mt-3">
                  <img :src="step.imageUrl" :alt="`步骤${index + 1}`" class="w-full rounded-xl"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4 py-2">
        <div class="glass-effect rounded-2xl p-5 border-gradient-accent">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 rounded-full bg-accent"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">小贴士</h2>
          </div>
          <p class="text-secondary leading-relaxed">{{ recipe.tips || '暂无小贴士' }}</p>
        </div>
      </div>

      <div class="px-4 py-2">
        <div class="glass-effect rounded-2xl p-5 border-gradient-warning">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-2 h-2 rounded-full bg-warning"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">参考做法</h2>
          </div>
          <div class="space-y-3">
            <div
              v-for="(link, index) in referenceLinks"
              :key="index"
              class="flex items-center gap-3 p-3 rounded-xl glass-effect-light card-hover cursor-pointer"
              @click="openLink(link.url)"
            >
              <div class="w-10 h-10 rounded-lg gradient-warning flex items-center justify-center shadow-bright">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-dark font-medium text-sm">{{ link.title }}</p>
                <p class="text-xs text-secondary">{{ link.source }}</p>
              </div>
              <svg class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-primary/20 flex items-center justify-center">
        <div class="status-dot status-pending"></div>
      </div>
      <p class="text-secondary text-sm">加载中...</p>
    </div>

    <div class="fixed bottom-0 left-0 right-0 px-4 py-4 glass-effect border-t border-primary/10">
      <div class="flex gap-3">
        <button
          @click="goBack"
          class="flex-1 py-3 rounded-xl font-semibold glass-effect-light border-primary/30 text-primary bright-button"
        >
          返回
        </button>
        <button
          v-if="recipe"
          @click="shareRecipe"
          class="flex-1 py-3 rounded-xl font-semibold glass-effect-light border-accent/30 text-accent bright-button"
        >
          分享
        </button>
        <button
          v-if="recipe"
          @click="addToMenu"
          class="flex-1 py-3 gradient-primary text-white rounded-xl font-semibold shadow-bright bright-button"
        >
          加入菜单
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRecipeStore } from '../stores/recipes.js';
import { useMealPickStore } from '../stores/mealPicks.js';
import { useShoppingListStore } from '../stores/shoppingList.js';
import { useFavoriteStore } from '../stores/favorites.js';

const router = useRouter();
const route = useRoute();
const recipeStore = useRecipeStore();
const mealPickStore = useMealPickStore();
const shoppingListStore = useShoppingListStore();
const favoriteStore = useFavoriteStore();

const recipe = ref(null);
const isFavorite = ref(false);
const toast = ref({ show: false, message: '', success: true });

const ingredients = computed(() => recipe.value?.ingredients || []);
const steps = computed(() => recipe.value?.steps || []);

const mainIngredients = computed(() => ingredients.value.filter(i => i.category === '主料'));
const otherIngredients = computed(() => ingredients.value.filter(i => i.category !== '主料'));

const referenceLinks = computed(() => [
  {
    title: `${recipe.value?.title || '菜谱'}做法 - 小红书`,
    source: '小红书',
    url: `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(recipe.value?.title || '菜谱')}&type=note`
  },
  {
    title: `${recipe.value?.title || '菜谱'}教程 - 美食天下`,
    source: '美食天下',
    url: `https://home.meishichina.com/search/?q=${encodeURIComponent(recipe.value?.title || '菜谱')}`
  },
  {
    title: `${recipe.value?.title || '菜谱'}视频教程 - B站`,
    source: 'B站',
    url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(recipe.value?.title || '菜谱')}做法`
  }
]);

function showToast(message, success = true) {
  toast.value = { show: true, message, success };
  setTimeout(() => {
    toast.value.show = false;
  }, 2000);
}

function getDifficultyStatus(difficulty) {
  const statuses = {
    '简单': 'status-active',
    '中等': 'status-pending',
    '困难': 'status-completed'
  };
  return statuses[difficulty] || 'status-pending';
}

async function loadRecipe() {
  const id = route.params.id;
  const data = await recipeStore.fetchRecipe(id);
  recipe.value = data;
}

async function checkFavoriteStatus() {
  if (recipe.value) {
    isFavorite.value = await favoriteStore.checkFavorite(recipe.value.id);
  }
}

function goBack() {
  router.back();
}

async function toggleFavorite() {
  if (!recipe.value) return;
  
  if (isFavorite.value) {
    const result = await favoriteStore.removeFavorite(recipe.value.id);
    if (result.success) {
      isFavorite.value = false;
    }
  } else {
    const result = await favoriteStore.addFavorite(recipe.value.id, recipe.value.title);
    if (result.success) {
      isFavorite.value = true;
    } else {
      showToast(result.message, false);
    }
  }
}

async function addToMenu() {
  if (!recipe.value) return;
  const result = await mealPickStore.addMealPick(recipe.value.id, recipe.value.title);
  if (!result.success) {
    showToast(result.message, false);
  } else {
    showToast('已加入今日菜单');
  }
}

async function addMainToShoppingList() {
  if (!recipe.value) return;
  let successCount = 0;
  for (const ing of mainIngredients.value) {
    const result = await shoppingListStore.addShoppingItem(ing.name, ing.amount);
    if (result.success) {
      successCount++;
    }
  }
  if (successCount > 0) {
    showToast(`已添加 ${successCount} 个主食材到购物清单`);
  } else {
    showToast('添加失败', false);
  }
}

function shareRecipe() {
  if (!recipe.value) return;
  const shareText = `${recipe.value.title}\n食材：${ingredients.value.map(i => `${i.name} ${i.amount}`).join('、')}\n步骤：${steps.value.map((s, i) => `${i+1}. ${s.content}`).join('\n')}`;
  if (navigator.share) {
    navigator.share({
      title: recipe.value.title,
      text: shareText
    });
  } else {
    alert('分享功能不支持，请手动复制');
  }
}

function openLink(url) {
  window.open(url, '_blank');
}

onMounted(async () => {
  await loadRecipe();
  await checkFavoriteStatus();
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