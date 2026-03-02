import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000
})

// 菜品API
export const dishApi = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  getCategories: () => api.get('/dishes/categories/list'),
  getDailyRecommend: () => api.get('/dishes/recommend/daily'),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`)
}

// 食材API
export const ingredientApi = {
  getAll: (params) => api.get('/ingredients', { params }),
  getCategories: () => api.get('/ingredients/categories')
}

// 购物清单API
export const shoppingApi = {
  get: (date) => api.get('/shopping-list', { params: { date } }),
  save: (data) => api.post('/shopping-list', data),
  delete: (id) => api.delete(`/shopping-list/${id}`)
}

// AI API
export const aiApi = {
  recommend: (params) => api.post('/ai/recommend', params),
  plan: (params) => api.post('/ai/plan', params),
  chat: (params) => api.post('/ai/chat', params),
  recommendByMood: (params) => api.post('/ai/recommend-by-mood', params),
  getSeasonal: () => api.get('/ai/seasonal'),
  rollDice: (params) => api.post('/ai/roll-dice', params),
  ingredientRecipe: (params) => api.post('/ai/ingredient-recipe', params),
  getMoodOptions: () => api.get('/ai/mood-options')
}

// 视频API
export const videoApi = {
  searchBilibili: (keyword) => api.get('/videos/bilibili', { params: { keyword } }),
  getRecipeVideos: (dishName) => api.get(`/videos/recipe/${dishName}`)
}

// 食材库存API
export const stockApi = {
  getAll: () => api.get('/stock'),
  add: (data) => api.post('/stock', data),
  update: (id, data) => api.put(`/stock/${id}`, data),
  delete: (id) => api.delete(`/stock/${id}`),
  getExpiring: () => api.get('/stock/expiring')
}

// 菜谱收藏API
export const favoritesApi = {
  getAll: () => api.get('/favorites/list'),
  add: (dishId) => api.post('/favorites/add', { dish_id: dishId }),
  remove: (dishId) => api.delete(`/favorites/remove/${dishId}`),
  check: (dishId) => api.get(`/favorites/check/${dishId}`)
}

// 菜单计划API
export const menuApi = {
  getAll: (params) => api.get('/menu', { params }),
  add: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`)
}

// 烹饪记录API
export const cookingApi = {
  getHistory: (limit) => api.get('/cooking/history', { params: { limit } }),
  record: (data) => api.post('/cooking/record', data),
  getStats: () => api.get('/cooking/stats')
}

// 成就API
export const achievementsApi = {
  getAll: () => api.get('/achievements'),
  getMy: () => api.get('/achievements/my'),
  check: () => api.post('/achievements/check')
}

// 家庭API
export const familyApi = {
  get: () => api.get('/family'),
  create: (name) => api.post('/family/create', { name }),
  join: (inviteCode, memberName) => api.post('/family/join', { invite_code: inviteCode, member_name: memberName }),
  update: (name) => api.put('/family', { name }),
  refreshCode: () => api.post('/family/refresh-code'),
  removeMember: (id) => api.delete(`/family/members/${id}`)
}

// 购物车API
export const cartApi = {
  getAll: () => api.get('/cart'),
  add: (dishId, dishName, quantity) => api.post('/cart', { dish_id: dishId, dish_name: dishName, quantity }),
  update: (dishId, quantity) => api.put(`/cart/${dishId}`, { quantity }),
  remove: (dishId) => api.delete(`/cart/item/${dishId}`),
  clear: () => api.delete('/cart/clear')
}

// 用户偏好API
export const preferencesApi = {
  get: () => api.get('/preferences'),
  update: (data) => api.put('/preferences', data)
}

export default api
