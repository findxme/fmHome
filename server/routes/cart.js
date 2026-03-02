import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取购物车
router.get(async (req, res) => {
  const db = getDatabase();
  try {
    const cart = await db.prepare('SELECT * FROM carts ORDER BY added_at DESC').all();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加到购物车
router.post(async (req, res) => {
  const db = getDatabase();
  const { dish_id, dish_name, quantity = 1 } = req.body;
  try {
    // 检查是否已存在
    const existing = await db.prepare('SELECT * FROM carts WHERE dish_id = ?').get(dish_id);

    if (existing) {
      db.prepare('UPDATE carts SET quantity = quantity + ? WHERE dish_id = ?').run(quantity, dish_id);
    } else {
      db.prepare('INSERT INTO carts (dish_id, dish_name, quantity) VALUES (?, ?, ?)').run(dish_id, dish_name, quantity);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新数量
router.put(async (req, res) => {
  const db = getDatabase();
  const { dishId } = req.params;
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      db.prepare('DELETE FROM carts WHERE dish_id = ?').run(dishId);
    } else {
      db.prepare('UPDATE carts SET quantity = ? WHERE dish_id = ?').run(quantity, dishId);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除
router.delete(async (req, res) => {
  const db = getDatabase();
  const { dishId } = req.params;
  try {
    db.prepare('DELETE FROM carts WHERE dish_id = ?').run(dishId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 清空购物车
router.delete(async (req, res) => {
  const db = getDatabase();
  try {
    db.prepare('DELETE FROM carts').run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
