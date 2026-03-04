/**
 * 购物车管理路由
 * 
 * 功能说明：
 * - 获取购物车中的所有菜品
 * - 添加菜品到购物车（支持数量累加）
 * - 更新购物车中菜品的数量
 * - 删除购物车中的单个菜品
 * - 清空整个购物车
 * 
 * 数据表：carts（关联 dishes 表获取菜品详情）
 */

import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

/**
 * 获取购物车列表
 * 
 * 请求方式：GET /api/cart
 * 返回：购物车中所有菜品及其详情（包括食材、步骤等）
 * 关联查询：从 dishes 表联查获取完整菜品信息
 */
router.get('/', async (req, res) => {
  const db = getDatabase();
  try {
    const cart = await db.prepare(`
      SELECT c.*, d.name, d.category, d.tags, d.image_url, d.difficulty, d.cooking_time, d.servings, d.description, d.ingredients, d.steps, d.tips
      FROM carts c
      LEFT JOIN dishes d ON c.dish_id = d.id
      ORDER BY c.added_at DESC
    `).all();
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 添加菜品到购物车
 * 
 * 请求方式：POST /api/cart
 * 请求体：{ dish_id, dish_name, quantity }
 * 逻辑：
 *   - 如果菜品已存在，数量累加
 *   - 如果是新菜品，插入新记录
 */
router.post('/', async (req, res) => {
  const db = getDatabase();
  const { dish_id, dish_name, quantity = 1 } = req.body;
  try {
    // 检查是否已存在
    const existing = await db.prepare('SELECT * FROM carts WHERE dish_id = ?').get(dish_id);

    if (existing) {
      await db.prepare('UPDATE carts SET quantity = quantity + ? WHERE dish_id = ?').run(quantity, dish_id);
    } else {
      await db.prepare('INSERT INTO carts (dish_id, dish_name, quantity) VALUES (?, ?, ?)').run(dish_id, dish_name, quantity);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 更新购物车中菜品的数量
 * 
 * 请求方式：PUT /api/cart/:dish_id
 * 路径参数：dish_id - 菜品ID
 * 请求体：{ quantity }
 * 逻辑：
 *   - quantity <= 0 时删除该记录
 *   - quantity > 0 时更新数量
 */
router.put('/:dish_id', async (req, res) => {
  const db = getDatabase();
  const { dish_id } = req.params;
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      await db.prepare('DELETE FROM carts WHERE dish_id = ?').run(dish_id);
    } else {
      await db.prepare('UPDATE carts SET quantity = ? WHERE dish_id = ?').run(quantity, dish_id);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 删除购物车中的单个菜品
 * 
 * 请求方式：DELETE /api/cart/:dish_id 或 /api/cart/item/:dish_id
 * 路径参数：dish_id - 菜品ID
 * 返回：成功返回 true
 */
router.delete(['/:dish_id', '/item/:dish_id'], async (req, res) => {
  const db = getDatabase();
  const { dish_id } = req.params;
  try {
    await db.prepare('DELETE FROM carts WHERE dish_id = ?').run(dish_id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 清空购物车
 * 
 * 请求方式：DELETE /api/cart/clear
 * 返回：成功返回 true
 */
router.delete('/clear', async (req, res) => {
  const db = getDatabase();
  try {
    await db.prepare('DELETE FROM carts').run();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
