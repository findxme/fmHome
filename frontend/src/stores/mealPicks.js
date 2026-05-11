import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api.js';

export const useMealPickStore = defineStore('mealPicks', () => {
  const picks = ref([]);
  const loading = ref(false);

  async function fetchMealPicks() {
    loading.value = true;
    try {
      const response = await api.get('/meal-picks');
      picks.value = response.data.data;
    } catch (error) {
      console.error('获取今日菜单失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addMealPick(recipeId, recipeTitle) {
    try {
      const response = await api.post('/meal-picks', { recipeId, recipeTitle });
      if (response.data.success) {
        picks.value.push(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error('添加菜单失败:', error);
      return { success: false, message: '添加失败' };
    }
  }

  async function toggleMealPick(id) {
    try {
      const response = await api.put(`/meal-picks/${id}/toggle`);
      if (response.data.success) {
        const pick = picks.value.find(p => p.id === id);
        if (pick) {
          pick.status = response.data.data.status;
        }
      }
      return response.data;
    } catch (error) {
      console.error('切换状态失败:', error);
    }
  }

  async function clearMealPicks() {
    try {
      const response = await api.delete('/meal-picks/clear');
      if (response.data.success) {
        picks.value = [];
      }
      return response.data;
    } catch (error) {
      console.error('清空菜单失败:', error);
    }
  }

  return {
    picks,
    loading,
    fetchMealPicks,
    addMealPick,
    toggleMealPick,
    clearMealPicks
  };
});
