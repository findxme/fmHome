/**
 * fmHome API 客户端
 * 
 * 基于 Axios 封装的 API 调用模块
 * 统一管理所有后端接口，按功能模块分组
 * 
 * 模块说明：
 * - dishApi: 菜品管理（CRUD、分类、搜索、推荐）
 * - ingredientApi: 食材管理
 * - shoppingApi: 购物清单管理
 * - aiApi: AI 智能推荐（心情推荐、菜单规划、烹饪问答）
 * - videoApi: 视频教程（关联 B站 视频）
 * - stockApi: 食材库存管理
 * - favoritesApi: 菜品收藏
 * - menuApi: 菜单计划
 * - cookingApi: 烹饪记录与统计
 * - achievementsApi: 成就系统
 * - familyApi: 家庭管理
 * - cartApi: 购物车
 * - checkinApi: 打卡功能
 * - preferencesApi: 用户偏好设置
 * - todoApi: 待办事项
 * - templateApi: 购物模板
 * - historyApi: 购买历史
 * - browseHistoryApi: 浏览历史
 */

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000
})

// ============ 菜品 API ============
/**
 * 菜品管理接口
 * - getAll: 获取所有菜品，支持分类、搜索、标签筛选
 * - getById: 获取单个菜品详情
 * - getCategories: 获取所有分类
 * - getDailyRecommend: 获取每日推荐
 * - create: 创建新菜品
 * - update: 更新菜品信息
 * - delete: 删除菜品
 */
export const dishApi = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  getCategories: () => api.get('/dishes/categories/list'),
  getDailyRecommend: () => api.get('/dishes/recommend/daily'),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`)
}

// ============ 食材 API ============
/**
 * 食材管理接口
 * - getAll: 获取所有食材
 * - getCategories: 获取食材分类
 */
export const ingredientApi = {
  getAll: (params) => api.get('/ingredients', { params }),
  getCategories: () => api.get('/ingredients/categories')
}

// ============ 购物清单 API ============
/**
 * 购物清单接口
 * - get: 获取购物清单（按日期）
 * - save: 创建/保存购物清单
 * - update: 更新清单中的物品
 * - delete: 删除购物清单
 */
export const shoppingApi = {
  get: (date) => api.get('/shopping-list', { params: { date } }),
  save: (data) => api.post('/shopping-list', data),
  update: (id, items) => api.put('/shopping-list', { id, items }),
  delete: (id) => api.delete(`/shopping-list/${id}`)
}

// ============ AI 智能推荐 API ============
/**
 * AI 智能厨师助手接口
 * - recommend: 智能推荐（按口味、难度、食材）
 * - plan: AI 菜单规划
 * - chat: 烹饪问答
 * - recommendByMood: 心情推荐
 * - getSeasonal: 季节推荐
 * - rollDice: 随机选菜（纠结时使用）
 * - ingredientRecipe: 食材成菜（根据现有食材推荐菜谱）
 * - getMoodOptions: 获取心情选项列表
 */
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

// ============ 视频教程 API ============
/**
 * 视频教程接口
 * - searchBilibili: 搜索 B站 视频
 * - getRecipeVideos: 获取特定菜品的做法视频
 */
export const videoApi = {
  searchBilibili: (keyword) => api.get('/videos/bilibili', { params: { keyword } }),
  getRecipeVideos: (dishName) => api.get(`/videos/recipe/${dishName}`)
}

// ============ 食材库存 API ============
/**
 * 食材库存管理接口
 * - getAll: 获取所有库存
 * - add: 添加食材到库存
 * - update: 更新库存信息
 * - delete: 删除库存记录
 * - getExpiring: 获取即将过期的食材
 */
export const stockApi = {
  getAll: () => api.get('/stock'),
  add: (data) => api.post('/stock', data),
  update: (id, data) => api.put(`/stock/${id}`, data),
  delete: (id) => api.delete(`/stock/${id}`),
  getExpiring: () => api.get('/stock/expiring')
}

// ============ 收藏 API ============
/**
 * 菜品收藏接口
 * - getAll: 获取所有收藏
 * - add: 添加收藏
 * - remove: 取消收藏
 * - check: 检查是否已收藏
 */
export const favoritesApi = {
  getAll: () => api.get('/favorites/list'),
  add: (dishId) => api.post('/favorites/add', { dish_id: dishId }),
  remove: (dishId) => api.delete(`/favorites/remove/${dishId}`),
  check: (dishId) => api.get(`/favorites/check/${dishId}`)
}

// ============ 菜单计划 API ============
/**
 * 菜单计划接口
 * - getAll: 获取菜单计划
 * - add: 添加菜单计划
 * - update: 更新菜单计划
 * - delete: 删除菜单计划
 */
export const menuApi = {
  getAll: (params) => api.get('/menu', { params }),
  add: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`)
}

// ============ 烹饪记录 API ============
/**
 * 烹饪记录接口
 * - getHistory: 获取烹饪历史
 * - record: 记录烹饪（包含评分和笔记）
 * - getStats: 获取烹饪统计数据
 */
export const cookingApi = {
  getHistory: (limit) => api.get('/cooking/history', { params: { limit } }),
  record: (data) => api.post('/cooking/record', data),
  getStats: () => api.get('/cooking/stats')
}

// ============ 成就系统 API ============
/**
 * 成就系统接口
 * - getAll: 获取所有成就列表
 * - getMy: 获取我的成就进度
 * - check: 检查并解锁新成就
 */
export const achievementsApi = {
  getAll: () => api.get('/achievements'),
  getMy: () => api.get('/achievements/my'),
  check: () => api.post('/achievements/check')
}

// ============ 家庭管理 API ============
/**
 * 家庭管理接口
 * - get: 获取家庭信息
 * - create: 创建家庭
 * - join: 通过邀请码加入家庭
 * - update: 更新家庭名称
 * - refreshCode: 刷新邀请码
 * - removeMember: 移除成员
 * - addMember: 添加成员
 */
export const familyApi = {
  get: () => api.get('/family'),
  create: (name) => api.post('/family/create', { name }),
  join: (inviteCode, memberName) => api.post('/family/join', { invite_code: inviteCode, member_name: memberName }),
  update: (name) => api.put('/family', { name }),
  refreshCode: () => api.post('/family/refresh-code'),
  removeMember: (id) => api.delete(`/family/members/${id}`),
  addMember: (data) => api.post('/family/members', data)
}

// ============ 购物车 API ============
/**
 * 购物车接口
 * - getAll: 获取购物车内容
 * - add: 添加菜品到购物车
 * - update: 更新菜品数量
 * - remove: 移除单个菜品
 * - clear: 清空购物车
 */
export const cartApi = {
  getAll: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/item/${id}`),
  clear: () => api.delete('/cart/clear')
}

// ============ 打卡 API ============
/**
 * 每日打卡接口
 * - get: 获取打卡记录
 * - checkin: 执行打卡
 * - remove: 取消打卡
 */
export const checkinApi = {
  get: () => api.get('/checkin'),
  checkin: (date) => api.post('/checkin', { date }),
  remove: (date) => api.delete(`/checkin/${date}`)
}

// ============ 用户偏好 API ============
/**
 * 用户偏好设置接口
 * - get: 获取偏好设置
 * - update: 更新偏好设置
 */
export const preferencesApi = {
  get: () => api.get('/preferences'),
  update: (data) => api.put('/preferences', data)
}

export default api

// ============ 待办事项 API ============
/**
 * 待办事项接口
 * - getAll: 获取所有待办
 * - add: 添加待办
 * - update: 更新待办状态
 * - delete: 删除待办
 */
export const todoApi = {
  getAll: () => api.get('/extra/todos'),
  add: (content) => api.post('/extra/todos', { content }),
  update: (id, data) => api.put(`/extra/todos/${id}`, data),
  delete: (id) => api.delete(`/extra/todos/${id}`)
}

// ============ 购物模板 API ============
/**
 * 购物模板接口
 * - getAll: 获取所有模板
 * - save: 保存新模板
 * - delete: 删除模板
 */
export const templateApi = {
  getAll: () => api.get('/extra/shopping-templates'),
  save: (name, items) => api.post('/extra/shopping-templates', { name, items }),
  delete: (id) => api.delete(`/extra/shopping-templates/${id}`)
}

// ============ 购买历史 API ============
/**
 * 购买历史接口
 * - get: 获取购买历史
 * - save: 保存购买记录
 */
export const historyApi = {
  get: () => api.get('/extra/purchase-history'),
  save: (items) => api.post('/extra/purchase-history', { items })
}

// ============ 浏览历史 API ============
/**
 * 浏览历史接口
 * - get: 获取浏览历史
 * - add: 添加浏览记录
 * - clear: 清空浏览历史
 */
export const browseHistoryApi = {
  get: (limit) => api.get('/extra/history', { params: { limit } }),
  add: (dishId) => api.post('/extra/history', { dish_id: dishId }),
  clear: () => api.delete('/extra/history')
}
