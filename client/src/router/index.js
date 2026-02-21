import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/views/Menu.vue')
  },
  {
    path: '/dish/:id',
    name: 'DishDetail',
    component: () => import('@/views/DishDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue')
  },
  {
    path: '/shopping-list',
    name: 'ShoppingList',
    component: () => import('@/views/ShoppingList.vue')
  },
  {
    path: '/ai-assistant',
    name: 'AIAssistant',
    component: () => import('@/views/AIAssistant.vue')
  },
  {
    path: '/ai-recommend',
    name: 'SmartRecommendation',
    component: () => import('@/views/SmartRecommendation.vue')
  },
  {
    path: '/family',
    name: 'FamilyKitchen',
    component: () => import('@/views/FamilyKitchen.vue')
  },
  {
    path: '/add-dish',
    name: 'AddDish',
    component: () => import('@/views/AddDish.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/views/Achievements.vue')
  },
  {
    path: '/family-manage',
    name: 'FamilyManage',
    component: () => import('@/views/FamilyManage.vue')
  },
  {
    path: '/ingredient-scanner',
    name: 'IngredientScanner',
    component: () => import('@/views/IngredientScanner.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
