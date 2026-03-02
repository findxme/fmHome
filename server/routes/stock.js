import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取食材库存
router.get(async (req, res) => {
  const db = getDatabase();
  try {
    const stock = await db.prepare('SELECT * FROM ingredient_stock ORDER BY created_at DESC').all();
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加食材到库存
router.post(async (req, res) => {
  const db = getDatabase();
  const { ingredient_name, quantity, unit, category, expiry_date } = req.body;
  try {
    const stmt = await db.prepare(`
      INSERT INTO ingredient_stock (ingredient_name, quantity, unit, category, expiry_date)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(ingredient_name, quantity, unit, category, expiry_date);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新库存
router.put(async (req, res) => {
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

// 删除库存
router.delete(async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM ingredient_stock WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取即将过期食材
router.get(async (req, res) => {
  const db = getDatabase();
  try {
    const stock = await db.prepare(`
      SELECT * FROM ingredient_stock
      WHERE expiry_date IS NOT NULL
      AND expiry_date <= date('now', '+3 days')
      AND status = 'in_stock'
      ORDER BY expiry_date ASC
    `).all();
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
