import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

const Home = () => import('./pages/Home.vue');
const Recipes = () => import('./pages/Recipes.vue');
const RecipeDetail = () => import('./pages/RecipeDetail.vue');
const RecipeForm = () => import('./pages/RecipeForm.vue');
const Ledger = () => import('./pages/Ledger.vue');
const Favorites = () => import('./pages/Favorites.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/recipes', name: 'Recipes', component: Recipes },
    { path: '/recipe/:id', name: 'RecipeDetail', component: RecipeDetail },
    { path: '/recipe-form', name: 'RecipeForm', component: RecipeForm },
    { path: '/recipe-form/:id', name: 'RecipeEdit', component: RecipeForm },
    { path: '/favorites', name: 'Favorites', component: Favorites },
    { path: '/ledger', name: 'Ledger', component: Ledger }
  ]
});

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
