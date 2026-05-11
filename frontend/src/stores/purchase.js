import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api.js';

export const usePurchaseStore = defineStore('purchase', () => {
  const records = ref([]);
  const stats = ref(null);
  const loading = ref(false);

  async function fetchPurchases(month) {
    loading.value = true;
    try {
      const params = month ? { month } : {};
      const response = await api.get('/purchases', { params });
      records.value = response.data.data;
    } catch (error) {
      console.error('获取采购记录失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createPurchase(data) {
    try {
      const response = await api.post('/purchases', data);
      records.value.unshift(response.data.data);
      return response.data;
    } catch (error) {
      console.error('创建采购记录失败:', error);
      throw error;
    }
  }

  async function getPurchaseStats(month) {
    loading.value = true;
    try {
      const params = month ? { month } : {};
      const response = await api.get('/purchases/stats', { params });
      stats.value = response.data.data;
      return stats.value;
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      loading.value = false;
    }
  }

  async function deletePurchase(id) {
    try {
      await api.delete(`/purchases/${id}`);
      records.value = records.value.filter(r => r.id !== id);
    } catch (error) {
      console.error('删除采购记录失败:', error);
    }
  }

  async function updatePurchase(id, data) {
    try {
      const response = await api.put(`/purchases/${id}`, data);
      const index = records.value.findIndex(r => r.id === id);
      if (index !== -1) {
        records.value[index] = response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('更新采购记录失败:', error);
      throw error;
    }
  }

  return {
    records,
    stats,
    loading,
    fetchPurchases,
    createPurchase,
    getPurchaseStats,
    deletePurchase,
    updatePurchase
  };
});
