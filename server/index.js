// GitHub Issue #16 测试备注：多 agent 协作验证
// 少行 祝大家工作顺利，代码无 bug！🚀

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import dishRoutes from './routes/dishes.js';
import ingredientRoutes from './routes/ingredients.js';
import shoppingRoutes from './routes/shopping.js';
import aiRoutes from './routes/ai.js';
import videoRoutes from './routes/videos.js';
import stockRoutes from './routes/stock.js';
import favoritesRoutes from './routes/favorites.js';
import menuRoutes from './routes/menu.js';
import cookingRoutes from './routes/cooking.js';
import achievementsRoutes from './routes/achievements.js';
import familyRoutes from './routes/family.js';
import cartRoutes from './routes/cart.js';
import preferencesRoutes from './routes/preferences.js';
import extraRoutes from './routes/extra.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量（优先 .env.local）
dotenv.config({ path: path.resolve(__dirname, '.env.local') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 前端静态文件
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// API 不使用缓存，确保数据实时同步

// 路由
app.use('/api/dishes', dishRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/shopping-list', shoppingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cooking', cookingRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/extra', extraRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '家庭点餐系统服务运行中' });
});

// 初始化数据库并启动
initDatabase();

// SPA 路由回退 - 所有非 API 请求返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🍽️ 家庭点餐服务已启动: http://0.0.0.0:${PORT}`);
});
