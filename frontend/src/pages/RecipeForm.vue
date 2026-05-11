<template>
  <div class="min-h-screen bg-secondary pb-24">
    <header class="glass-effect px-4 py-4 sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <button @click="goBack" class="text-secondary hover:text-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 class="text-xl font-bold gradient-text">{{ isEdit ? '编辑菜谱' : '新建菜谱' }}</h1>
        <button @click="saveRecipe" class="px-4 py-1.5 gradient-primary text-white text-sm rounded-lg shadow-md hover:shadow-lg transition-all">
          保存
        </button>
      </div>
    </header>

    <div class="px-4 py-4">
      <div class="glass-effect rounded-2xl p-4">
        <label class="block text-sm font-medium text-dark mb-2">菜谱名称</label>
        <input
          v-model="form.title"
          placeholder="请输入菜谱名称"
          class="w-full px-4 py-3 rounded-xl text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
        />
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <label class="block text-sm font-medium text-dark mb-2">菜谱图片</label>
        <div class="flex gap-2">
          <input
            v-model="form.imageUrl"
            placeholder="输入图片URL"
            class="flex-1 px-4 py-3 rounded-xl text-dark text-sm bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
          />
          <button @click="generateImage" class="px-4 py-3 rounded-xl text-sm border-2 border-primary/30 text-primary hover:bg-primary/5 transition-all">
            AI生成
          </button>
        </div>
        <div v-if="form.imageUrl" class="mt-3">
          <img :src="form.imageUrl" alt="预览" class="w-full h-32 object-cover rounded-xl"/>
        </div>
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <label class="block text-sm font-medium text-dark mb-2">分类</label>
        <select v-model="form.category" class="w-full px-4 py-3 rounded-xl text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all">
          <option value="">请选择分类</option>
          <option value="家常菜">家常菜</option>
          <option value="快手菜">快手菜</option>
          <option value="汤类">汤类</option>
          <option value="素菜">素菜</option>
          <option value="下饭菜">下饭菜</option>
        </select>
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-dark mb-2">烹饪时间</label>
            <input
              v-model="form.cookTime"
              placeholder="如：30分钟"
              class="w-full px-4 py-3 rounded-xl text-dark text-sm bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
            />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-dark mb-2">难度</label>
            <select v-model="form.difficulty" class="w-full px-4 py-3 rounded-xl text-dark text-sm bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all">
              <option value="">请选择</option>
              <option value="简单">简单</option>
              <option value="中等">中等</option>
              <option value="困难">困难</option>
            </select>
          </div>
        </div>
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-dark">食材清单</h3>
          <button @click="addIngredient" class="text-sm text-primary font-medium hover:text-accent transition-colors">+ 添加</button>
        </div>
        <div class="space-y-2">
          <div
            v-for="(item, index) in form.ingredients"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="item.name"
              placeholder="食材名称"
              class="flex-1 px-3 py-2 rounded-lg text-sm text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
            />
            <input
              v-model="item.amountText"
              placeholder="用量"
              class="w-24 px-3 py-2 rounded-lg text-sm text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
            />
            <button @click="removeIngredient(index)" class="px-2 text-secondary/50 hover:text-red-400 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-dark">烹饪步骤</h3>
          <button @click="addStep" class="text-sm text-primary font-medium hover:text-accent transition-colors">+ 添加步骤</button>
        </div>
        <div class="space-y-3">
          <div
            v-for="(step, index) in form.steps"
            :key="index"
            class="relative"
          >
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 mt-2 shadow-md">
                <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
              </div>
              <div class="flex-1">
                <textarea
                  v-model="step.description"
                  :placeholder="`步骤${index + 1}`"
                  class="w-full px-3 py-2 rounded-lg text-sm text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all resize-none"
                  rows="2"
                ></textarea>
                <input
                  v-model="step.imageUrl"
                  placeholder="步骤图片URL（可选）"
                  class="w-full mt-2 px-3 py-2 rounded-lg text-sm text-dark bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all"
                />
                <div v-if="step.imageUrl" class="mt-2">
                  <img :src="step.imageUrl" alt="步骤图" class="w-full h-24 object-cover rounded-lg"/>
                </div>
              </div>
              <button @click="removeStep(index)" class="px-2 text-secondary/50 hover:text-red-400 transition-colors flex-shrink-0 mt-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-effect rounded-2xl p-4 mt-3">
        <label class="block text-sm font-medium text-dark mb-2">小贴士</label>
        <textarea
          v-model="form.tips"
          placeholder="烹饪小贴士（可选）"
          class="w-full px-4 py-3 rounded-xl text-dark text-sm bg-light border border-primary/10 focus:border-primary/30 focus:outline-none transition-all resize-none"
          rows="3"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRecipeStore } from '../stores/recipes.js';

const router = useRouter();
const route = useRoute();
const recipeStore = useRecipeStore();

const isEdit = computed(() => !!route.params.id);

const form = ref({
  title: '',
  imageUrl: '',
  category: '',
  cookTime: '',
  difficulty: '',
  ingredients: [{ name: '', amountText: '' }],
  steps: [{ description: '', imageUrl: '' }],
  tips: ''
});

async function loadRecipe() {
  if (!isEdit.value) return;
  const recipe = await recipeStore.getRecipeById(route.params.id);
  if (recipe) {
    form.value = {
      title: recipe.title || '',
      imageUrl: recipe.imageUrl || '',
      category: recipe.category || '',
      cookTime: recipe.cookTime || '',
      difficulty: recipe.difficulty || '',
      ingredients: recipe.ingredients?.length ? recipe.ingredients : [{ name: '', amountText: '' }],
      steps: recipe.steps?.length ? recipe.steps : [{ description: '', imageUrl: '' }],
      tips: recipe.tips || ''
    };
  }
}

function addIngredient() {
  form.value.ingredients.push({ name: '', amountText: '' });
}

function removeIngredient(index) {
  if (form.value.ingredients.length > 1) {
    form.value.ingredients.splice(index, 1);
  }
}

function addStep() {
  form.value.steps.push({ description: '', imageUrl: '' });
}

function removeStep(index) {
  if (form.value.steps.length > 1) {
    form.value.steps.splice(index, 1);
  }
}

function generateImage() {
  const prompt = encodeURIComponent(form.value.title + ' food photography, professional, high quality');
  form.value.imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=landscape_4_3`;
}

async function saveRecipe() {
  if (!form.value.title.trim()) {
    alert('请输入菜谱名称');
    return;
  }

  const recipeData = {
    title: form.value.title,
    imageUrl: form.value.imageUrl,
    category: form.value.category,
    cookTime: form.value.cookTime,
    difficulty: form.value.difficulty,
    ingredients: form.value.ingredients.filter(i => i.name.trim()),
    steps: form.value.steps.filter(s => s.description.trim()),
    tips: form.value.tips
  };

  if (isEdit.value) {
    await recipeStore.updateRecipe(route.params.id, recipeData);
  } else {
    await recipeStore.createRecipe(recipeData);
  }

  router.push('/recipes');
}

function goBack() {
  router.back();
}

onMounted(() => {
  loadRecipe();
});
</script>
