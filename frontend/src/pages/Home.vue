<template>
  <div class="min-h-screen pb-20 relative bg-white">
    <header class="relative py-8 px-4">
      <div class="relative">
        <div class="flex items-center gap-3 mb-2">
          <div class="status-dot status-active"></div>
          <span class="text-xs text-secondary">系统运行中</span>
        </div>
        <h1 class="text-3xl font-bold text-gradient tracking-wide mb-2">今天吃什么</h1>
        <p class="text-secondary text-sm">{{ todayStr }}</p>
      </div>
    </header>

    <div class="px-4 py-4">
      <div class="glass-effect rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-primary"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">今日菜单</h2>
          </div>
          <button @click="clearMenu" class="text-xs text-secondary hover:text-primary transition-colors">
            清空全部
          </button>
        </div>

        <div v-if="mealPicks.length === 0" class="text-center py-10">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-primary/20 flex items-center justify-center">
            <svg class="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <p class="text-secondary text-sm mb-3">还没有选择今日菜单</p>
          <button @click="goToRecipes" class="px-6 py-2 gradient-primary text-white rounded-lg text-sm bright-button">
            去选菜谱
          </button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="pick in mealPicks"
            :key="pick.id"
            class="flex items-center justify-between p-4 rounded-xl glass-effect-light card-hover"
            :class="{ 'opacity-50': pick.status === 'completed' }"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ pick.recipeTitle.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-semibold text-dark mb-1">{{ pick.recipeTitle }}</p>
                <div class="flex items-center gap-2">
                  <div class="status-dot" :class="pick.status === 'completed' ? 'status-completed' : 'status-pending'"></div>
                  <p class="text-xs text-secondary">{{ pick.status === 'completed' ? '已完成' : '待制作' }}</p>
                </div>
              </div>
            </div>
            <button
              @click="togglePick(pick.id)"
              class="w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all bright-button"
              :class="pick.status === 'completed' ? 'gradient-success border-transparent' : 'border-primary/30 hover:border-primary'"
            >
              <svg v-if="pick.status === 'completed'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
          </div>
        </div>

        <button
          v-if="mealPicks.length > 0"
          @click="buildShoppingList"
          class="w-full mt-5 py-4 gradient-primary text-white rounded-xl font-semibold tracking-wider bright-button"
        >
          生成购物清单
        </button>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="glass-effect rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-success"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">购物清单</h2>
          </div>
          <span class="text-xs text-secondary">{{ uncheckedCount }} 件待买</span>
        </div>

        <div v-if="shoppingItems.length === 0" class="text-center py-8">
          <p class="text-secondary text-sm">购物清单为空</p>
        </div>

        <div v-else class="space-y-2">
          <div class="flex items-center justify-between mb-3">
            <button
              @click="toggleAllItems"
              class="text-sm text-primary hover:text-primary-light transition-colors bright-button"
            >
              {{ allChecked ? '取消全选' : '一键全选' }}
            </button>
            <span class="text-xs text-secondary">{{ uncheckedCount }} 件待买</span>
          </div>
          <div
            v-for="item in shoppingItems"
            :key="item.id"
            class="flex items-center gap-4 p-3 rounded-xl glass-effect-light card-hover"
            :class="item.checked ? 'border-gradient-success' : ''"
          >
            <button
              @click="toggleShoppingItem(item)"
              class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all"
              :class="item.checked ? 'gradient-success border-transparent' : 'border-primary/30 hover:border-primary'"
            >
              <svg v-if="item.checked" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
              </svg>
            </button>
            <div class="flex-1">
              <p :class="{ 'line-through text-secondary': item.checked }" class="text-dark font-medium">{{ item.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <input
                  v-model="item.amountText"
                  @blur="updateItemAmount(item)"
                  class="text-xs text-secondary bg-transparent border-b border-transparent hover:border-primary/30 focus:border-primary px-1 py-0.5 w-auto"
                  style="min-width: 60px"
                  placeholder="数量"
                />
              </div>
            </div>
            <button @click="deleteItem(item.id)" class="text-secondary/50 hover:text-accent transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="shoppingItems.length > 0" class="mt-4 pt-4 border-t border-primary/10">
          <div class="flex gap-3">
            <input
              v-model="newItemName"
              placeholder="添加物品..."
              class="flex-1 px-4 py-3 rounded-xl text-sm"
              @keyup.enter="addItem"
            />
            <button @click="addItem" class="px-6 py-3 gradient-primary text-white rounded-xl text-sm bright-button">
              添加
            </button>
          </div>
          <button
            v-if="checkedCount > 0"
            @click="completeItems"
            class="w-full mt-3 py-3 gradient-success text-white rounded-xl text-sm bright-button"
          >
            完成已选 ({{ checkedCount }})
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <div class="glass-effect rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-accent"></div>
            <h2 class="font-semibold text-lg tracking-wide text-dark">智能推荐</h2>
          </div>
          <button @click="refreshRandom" class="text-xs text-accent hover:text-primary transition-colors">
            换一个
          </button>
        </div>

        <div v-if="randomRecipe" @click="goToRecipe(randomRecipe.id)" class="cursor-pointer group">
          <div class="relative rounded-2xl overflow-hidden h-36">
            <img :src="randomRecipe.imageUrl" :alt="randomRecipe.title" class="w-full h-full object-cover transition-transform group-hover:scale-110"/>
            <div class="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 text-dark">
              <h3 class="font-bold text-lg mb-1">{{ randomRecipe.title }}</h3>
              <div class="flex items-center gap-3">
                <span class="text-xs">{{ randomRecipe.cookTime }}</span>
                <span class="text-xs px-2 py-1 rounded-full gradient-secondary text-white">{{ randomRecipe.difficulty }}</span>
              </div>
            </div>
          </div>
          <button
            @click.stop="addRandomToMenu"
            class="w-full mt-4 py-3 rounded-xl font-semibold tracking-wider transition-all border-2 border-accent/30 text-accent hover:bg-accent hover:text-white hover:border-transparent bright-button"
          >
            加入菜单
          </button>
        </div>

        <div v-else class="text-center py-10">
          <p class="text-secondary text-sm">暂无推荐菜谱</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMealPickStore } from '../stores/mealPicks.js';
import { useShoppingListStore } from '../stores/shoppingList.js';
import { useRecipeStore } from '../stores/recipes.js';

const router = useRouter();
const mealPickStore = useMealPickStore();
const shoppingStore = useShoppingListStore();
const recipeStore = useRecipeStore();

const newItemName = ref('');
const randomRecipe = ref(null);

const mealPicks = computed(() => mealPickStore.picks);
const shoppingItems = computed(() => shoppingStore.items);

const uncheckedCount = computed(() => shoppingItems.value.filter(i => !i.checked).length);
const checkedCount = computed(() => shoppingItems.value.filter(i => i.checked).length);
const allChecked = computed(() => shoppingItems.value.length > 0 && shoppingItems.value.every(i => i.checked));

const todayStr = computed(() => {
  const now = new Date();
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return `${now.getMonth() + 1}月${now.getDate()}日 ${weekdays[now.getDay()]}`;
});

async function init() {
  await mealPickStore.fetchMealPicks();
  await shoppingStore.fetchShoppingList();
  await loadRandomRecipe();
}

async function loadRandomRecipe() {
  const recipe = await recipeStore.getRandomRecipe();
  randomRecipe.value = recipe;
}

function refreshRandom() {
  loadRandomRecipe();
}

function goToRecipes() {
  router.push('/recipes');
}

function goToRecipe(id) {
  router.push(`/recipe/${id}`);
}

async function togglePick(id) {
  await mealPickStore.toggleMealPick(id);
}

async function clearMenu() {
  await mealPickStore.clearMealPicks();
}

async function buildShoppingList() {
  const recipeIds = mealPicks.value.map(p => p.recipeId);
  if (recipeIds.length === 0) {
    alert('请先选择今日菜单');
    return;
  }
  await shoppingStore.buildShoppingList(recipeIds);
}

async function toggleShoppingItem(item) {
  const newChecked = !item.checked;
  await shoppingStore.updateShoppingItems([{ id: item.id, checked: newChecked }]);
}

async function toggleAllItems() {
  const newChecked = !allChecked.value;
  const updates = shoppingItems.value.map(item => ({ id: item.id, checked: newChecked }));
  await shoppingStore.updateShoppingItems(updates);
}

async function updateItemAmount(item) {
  if (item.amountText && item.amountText.trim()) {
    await shoppingStore.updateShoppingItems([{ id: item.id, checked: item.checked }]);
  }
}

async function addItem() {
  if (!newItemName.value.trim()) return;
  await shoppingStore.addShoppingItem(newItemName.value.trim(), '');
  newItemName.value = '';
}

async function deleteItem(id) {
  await shoppingStore.deleteShoppingItem(id);
}

async function completeItems() {
  await shoppingStore.completeShoppingList('');
}

async function addRandomToMenu() {
  if (!randomRecipe.value) return;
  const result = await mealPickStore.addMealPick(randomRecipe.value.id, randomRecipe.value.title);
  if (!result.success) {
    alert(result.message);
  } else {
    await mealPickStore.fetchMealPicks();
    await loadRandomRecipe();
  }
}

onMounted(() => {
  init();
});
</script>