/**
 * 食材库存管理路由
 * 
 * 功能说明：
 * - 获取所有食材库存列表
 * - 获取即将过期的食材（3天内）
 * - 添加新食材到库存
 * - 更新食材库存信息（数量、单位、分类、保质期、状态）
 * - 删除库存中的食材
 * 
 * 数据表：ingredient_stock
 */

import express from 'express';
import { getDatabase } from '../mysqlDatabase.js';

const router = express.Router();

/**
 * 获取食材库存列表
 * 
 * 请求方式：GET /api/stock
 * 查询参数：无
 * 返回：所有食材库存记录，按创建时间倒序排列
 */
router.get('/', async (req, res) => {
  const db = getDatabase();
  try {
    const stock = await db.prepare('SELECT * FROM ingredient_stock ORDER BY created_at DESC').all();
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取即将过期食材（3天内）
 * 
 * 请求方式：GET /api/stock/expiring
 * 用途：提醒用户哪些食材即将过期，需要尽快使用
 * 返回：3天内过期的食材列表，按过期日期升序
 */
router.get('/expiring', async (req, res) => {
  const db = getDatabase();
  try {
    const stock = await db.prepare(`
      SELECT * FROM ingredient_stock
      WHERE expiry_date IS NOT NULL
      AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
      AND status = 'in_stock'
      ORDER BY expiry_date ASC
    `).all();
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 添加食材到库存
 * 
 * 请求方式：POST /api/stock
 * 请求体：{ ingredient_name, quantity, unit, category, expiry_date }
 * 返回：成功返回新记录的ID
 */
router.post('/', async (req, res) => {
  const db = getDatabase();
  const { ingredient_name, quantity, unit, category, expiry_date } = req.body;
  try {
    const stmt = await db.prepare(`
      INSERT INTO ingredient_stock (ingredient_name, quantity, unit, category, expiry_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(ingredient_name, quantity, unit, category, expiry_date);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 更新库存中的食材信息
 * 
 * 请求方式：PUT /api/stock/:id
 * 路径参数：id - 库存记录ID
 * 请求体：{ quantity, unit, category, expiry_date, status }
 * status 取值：'in_stock'（在库）, 'used'（已用完）, 'expired'（已过期）
 */
router.put('/:id', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { quantity, unit, category, expiry_date, status } = req.body;
  try {
    const stmt = await db.prepare(`
      UPDATE ingredient_stock
      SET quantity = ?, unit = ?, category = ?, expiry_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(quantity, unit, category, expiry_date, status, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 删除库存中的食材记录
 * 
 * 请求方式：DELETE /api/stock/:id
 * 路径参数：id - 库存记录ID
 * 返回：成功返回 true
 */
router.delete('/:id', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    await db.prepare('DELETE FROM ingredient_stock WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
