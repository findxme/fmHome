import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api.js';

export const useFavoriteStore = defineStore('favorites', () => {
  const favorites = ref([]);
  const loading = ref(false);

  async function fetchFavorites() {
    loading.value = true;
    try {
      const response = await api.get('/favorites');
      favorites.value = response.data.data;
    } catch (error) {
      console.error('获取收藏失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function addFavorite(recipeId, recipeTitle) {
    try {
      const response = await api.post('/favorites', { recipeId, recipeTitle });
      if (response.data.success) {
        favorites.value.push(response.data.data);
      }
      return response.data;
    } catch (error) {
      console.error('添加收藏失败:', error);
      return { success: false, message: '添加失败' };
    }
  }

  async function removeFavorite(recipeId) {
    try {
      const response = await api.delete(`/favorites/${recipeId}`);
      if (response.data.success) {
        favorites.value = favorites.value.filter(f => f.recipeId !== recipeId);
      }
      return response.data;
    } catch (error) {
      console.error('取消收藏失败:', error);
      return { success: false, message: '取消失败' };
    }
  }

  async function checkFavorite(recipeId) {
    try {
      const response = await api.get(`/favorites/check/${recipeId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      return false;
    }
  }

  function isFavorite(recipeId) {
    return favorites.value.some(f => f.recipeId === recipeId);
  }

  return {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
    isFavorite
  };
});