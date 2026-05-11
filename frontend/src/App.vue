<template>
  <div class="min-h-screen bg-secondary">
    <router-view />
    <TabBar />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const TabBar = defineAsyncComponent(() => import('./components/TabBar.vue'));
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
