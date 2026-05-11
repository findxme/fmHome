<template>
  <div class="min-h-screen pb-20 bg-white">
    <header class="py-4 px-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold">采购账本</h1>
        <button @click="showAddModal = true" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
          + 记一笔
        </button>
      </div>
      <div class="mt-3 flex gap-3">
        <div class="bg-gray-50 rounded-lg px-4 py-2 flex-1">
          <p class="text-xs text-gray-500">本月支出</p>
          <p class="text-xl font-bold">¥{{ monthlyTotal }}</p>
        </div>
        <div class="bg-gray-50 rounded-lg px-4 py-2 flex-1">
          <p class="text-xs text-gray-500">本月次数</p>
          <p class="text-xl font-bold">{{ monthlyCount }}</p>
        </div>
      </div>
    </header>

    <div class="px-4">
      <div class="bg-gray-50 rounded-xl p-4">
        <h2 class="font-semibold mb-3">采购记录</h2>
        <div v-if="purchases.length === 0" class="text-center py-6 text-gray-400">
          还没有采购记录
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="purchase in purchases"
            :key="purchase.id"
            class="bg-white rounded-lg p-3 border"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ purchase.storeName }}</p>
                <p class="text-xs text-gray-400">{{ purchase.purchaseDate }} {{ purchase.purchaseTime }}</p>
              </div>
              <span class="font-bold">¥{{ purchase.totalAmount }}</span>
            </div>
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="item in purchase.items"
                :key="item.id"
                class="px-2 py-1 bg-gray-100 rounded text-xs"
              >
                {{ item.name }} ¥{{ item.price }}
              </span>
            </div>
            <div class="mt-2 flex justify-end gap-2">
              <button @click="editPurchase(purchase)" class="text-xs text-blue-500">编辑</button>
              <button @click="deletePurchase(purchase.id)" class="text-xs text-red-500">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-md mx-auto rounded-xl p-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold">{{ isEditing ? '编辑采购' : '新增采购' }}</h3>
          <button @click="closeModal" class="text-gray-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div class="flex gap-2">
            <div class="flex-1">
              <label class="text-sm text-gray-600 mb-1 block">日期</label>
              <input v-model="form.date" type="date" class="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div class="flex-1">
              <label class="text-sm text-gray-600 mb-1 block">时间</label>
              <input v-model="form.time" type="time" class="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-600 mb-1 block">备注</label>
            <input v-model="form.note" placeholder="备注（可选）" class="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <label class="text-sm text-gray-600">物品清单</label>
              <button @click="addItem" class="text-sm text-blue-500">+ 添加</button>
            </div>
            <div class="space-y-2">
              <div v-for="(item, index) in form.items" :key="index" class="flex gap-2">
                <input v-model="item.name" placeholder="物品名称" class="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <input v-model="item.price" placeholder="价格" type="number" class="w-20 px-3 py-2 border rounded-lg text-sm" />
                <button v-if="form.items.length > 1" @click="removeItem(index)" class="px-2 text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button @click="savePurchase" class="w-full py-3 bg-blue-500 text-white rounded-lg font-medium">
            {{ isEditing ? '保存修改' : '保存记录' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePurchaseStore } from '../stores/purchase.js';

const purchaseStore = usePurchaseStore();

const showAddModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const purchases = computed(() => purchaseStore.records || []);

const currentMonthStr = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
});

const monthlyTotal = computed(() => {
  if (!purchases.value || purchases.value.length === 0) return '0.00';
  const total = purchases.value
    .filter(p => p && p.purchaseDate && p.purchaseDate.startsWith(currentMonthStr.value))
    .reduce((sum, p) => sum + parseFloat(p.totalAmount) || 0, 0);
  return total.toFixed(2);
});

const monthlyCount = computed(() => {
  if (!purchases.value || purchases.value.length === 0) return 0;
  return purchases.value.filter(p => p && p.purchaseDate && p.purchaseDate.startsWith(currentMonthStr.value)).length;
});

const form = ref({
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  items: [{ name: '', price: '' }],
  note: ''
});

function init() {
  purchaseStore.fetchPurchases(currentMonthStr.value);
}

function addItem() {
  form.value.items.push({ name: '', price: '' });
}

function removeItem(index) {
  form.value.items.splice(index, 1);
}

function closeModal() {
  showAddModal.value = false;
}

function editPurchase(purchase) {
  isEditing.value = true;
  editingId.value = purchase.id;
  form.value = {
    date: purchase.purchaseDate,
    time: purchase.purchaseTime || '',
    items: purchase.items.map(i => ({ name: i.name, price: i.price.toString() })),
    note: purchase.note || ''
  };
  showAddModal.value = true;
}

async function savePurchase() {
  const validItems = form.value.items.filter(i => i.name.trim() && i.price);
  if (validItems.length === 0) {
    alert('请至少添加一个物品');
    return;
  }

  const totalAmount = validItems.reduce((sum, i) => sum + (parseFloat(i.price) || 0), 0);

  const data = {
    storeName: '日常采购',
    date: form.value.date,
    time: form.value.time,
    items: validItems.map(i => ({
      name: i.name,
      quantity: 1,
      price: parseFloat(i.price) || 0
    })),
    totalAmount: totalAmount.toFixed(2),
    note: form.value.note
  };

  if (isEditing.value) {
    await purchaseStore.updatePurchase(editingId.value, data);
  } else {
    await purchaseStore.createPurchase(data);
  }

  closeModal();
}

async function deletePurchase(id) {
  if (!confirm('确定删除这条记录吗？')) return;
  await purchaseStore.deletePurchase(id);
}

onMounted(() => {
  init();
});
</script>