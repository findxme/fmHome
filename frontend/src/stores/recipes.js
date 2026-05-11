import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api.js';

export const useRecipeStore = defineStore('recipes', () => {
  const list = ref([]);
  const detail = ref(null);
  const filters = ref([]);
  const loading = ref(false);

  async function fetchRecipes() {
    loading.value = true;
    try {
      const response = await api.get('/recipes');
      list.value = response.data.data.list;
    } catch (error) {
      console.error('获取菜谱失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function fetchRecipe(id) {
    loading.value = true;
    try {
      const response = await api.get(`/recipes/${id}`);
      detail.value = response.data.data;
      return detail.value;
    } catch (error) {
      console.error('获取菜谱详情失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createRecipe(data) {
    try {
      const response = await api.post('/recipes', data);
      list.value.unshift(response.data.data);
      return response.data.data;
    } catch (error) {
      console.error('创建菜谱失败:', error);
      throw error;
    }
  }

  async function updateRecipe(id, data) {
    try {
      const response = await api.put(`/recipes/${id}`, data);
      const index = list.value.findIndex(r => r.id === id);
      if (index !== -1) {
        list.value[index] = response.data.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('更新菜谱失败:', error);
      throw error;
    }
  }

  async function deleteRecipe(id) {
    try {
      await api.delete(`/recipes/${id}`);
      list.value = list.value.filter(r => r.id !== id);
    } catch (error) {
      console.error('删除菜谱失败:', error);
      throw error;
    }
  }

  async function getRandomRecipe() {
    try {
      const response = await api.get('/recipes/random/get');
      return response.data.data;
    } catch (error) {
      console.error('获取随机菜谱失败:', error);
    }
  }

  return {
    list,
    detail,
    filters,
    loading,
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRandomRecipe
  };
});
