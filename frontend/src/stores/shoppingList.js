import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api.js';

export const useShoppingListStore = defineStore('shoppingList', () => {
  const items = ref([]);
  const loading = ref(false);

  async function fetchShoppingList() {
    loading.value = true;
    try {
      const response = await api.get('/shopping-list');
      items.value = response.data.data;
    } catch (error) {
      console.error('获取购物清单失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function buildShoppingList(recipeIds) {
    try {
      const response = await api.post('/shopping-list/build', { recipeIds });
      items.value = response.data.data;
      return response.data;
    } catch (error) {
      console.error('生成购物清单失败:', error);
      return { success: false, message: '生成失败' };
    }
  }

  async function updateShoppingItems(updateItems) {
    try {
      const response = await api.put('/shopping-list/items', { items: updateItems });
      updateItems.forEach(item => {
        const existing = items.value.find(i => i.id === item.id);
        if (existing) {
          existing.checked = item.checked;
          if (item.amountText) {
            existing.amountText = item.amountText;
          }
        }
      });
      return response.data;
    } catch (error) {
      console.error('更新购物清单失败:', error);
    }
  }

  async function addShoppingItem(name, amountText) {
    try {
      const response = await api.post('/shopping-list/item', { name, amountText });
      items.value.push(response.data.data);
      return response.data;
    } catch (error) {
      console.error('添加物品失败:', error);
      return { success: false, message: '添加失败' };
    }
  }

  async function deleteShoppingItem(id) {
    try {
      const response = await api.delete(`/shopping-list/item/${id}`);
      items.value = items.value.filter(i => i.id !== id);
      return response.data;
    } catch (error) {
      console.error('删除物品失败:', error);
    }
  }

  async function completeShoppingList(note) {
    try {
      const response = await api.post('/shopping-list/complete', { note });
      if (response.data.success) {
        items.value = items.value.filter(i => !i.checked);
      }
      return response.data;
    } catch (error) {
      console.error('完成清单失败:', error);
      return { success: false, message: '操作失败' };
    }
  }

  return {
    items,
    loading,
    fetchShoppingList,
    buildShoppingList,
    updateShoppingItems,
    addShoppingItem,
    deleteShoppingItem,
    completeShoppingList
  };
});
