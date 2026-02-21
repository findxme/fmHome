import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取收藏列表
router.get('/', (req, res) => {
  const db = getDatabase();
  try {
    const favorites = db.prepare(`
      SELECT f.*, d.name, d.image_url, d.category, d.difficulty, d.cooking_time
      FROM dish_favorites f
      LEFT JOIN dishes d ON f.dish_id = d.id
      ORDER BY f.created_at DESC
    `).all();
    res.json({ success: true, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加收藏
router.post('/', (req, res) => {
  const db = getDatabase();
  const { dish_id } = req.body;
  try {
    const stmt = db.prepare('INSERT OR IGNORE INTO dish_favorites (dish_id) VALUES (?)');
    stmt.run(dish_id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 取消收藏
router.delete('/:dishId', (req, res) => {
  const db = getDatabase();
  const { dishId } = req.params;
  try {
    db.prepare('DELETE FROM dish_favorites WHERE dish_id = ?').run(dishId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 检查是否收藏
router.get('/check/:dishId', (req, res) => {
  const db = getDatabase();
  const { dishId } = req.params;
  try {
    const result = db.prepare('SELECT id FROM dish_favorites WHERE dish_id = ?').get(dishId);
    res.json({ success: true, isFavorite: !!result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
