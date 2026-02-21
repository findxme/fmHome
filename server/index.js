import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 静态资源缓存
app.use(express.static('public', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// API缓存头 - 减少重复请求
app.use('/api', (req, res, next) => {
  if (req.method === 'POST') {
    return next();
  }
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
});

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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '家庭点餐系统服务运行中' });
});

// 初始化数据库并启动
initDatabase();

app.listen(PORT, () => {
  console.log(`🍽️ 家庭点餐服务已启动: http://localhost:${PORT}`);
});
