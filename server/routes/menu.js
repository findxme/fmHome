import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取菜单计划
router.get('/', async (req, res) => {
  const db = getDatabase();
  const { startDate, endDate } = req.query;
  try {
    let query = 'SELECT * FROM menu_plans';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date ASC, meal_type ASC';

    const plans = await db.prepare(query).all(...params);
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加菜单计划
router.post('/', async (req, res) => {
  const db = getDatabase();
  const { date, meal_type, dish_id, dish_name } = req.body;
  try {
    const stmt = await db.prepare(`
      INSERT INTO menu_plans (date, meal_type, dish_id, dish_name)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(date, meal_type, dish_id, dish_name);
    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新菜单计划
router.put('/:id', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const { date, meal_type, dish_id, dish_name } = req.body;
  try {
    const stmt = await db.prepare(`
      UPDATE menu_plans
      SET date = ?, meal_type = ?, dish_id = ?, dish_name = ?
      WHERE id = ?
    `);
    stmt.run(date, meal_type, dish_id, dish_name, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除菜单计划
router.delete('/:id', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    await db.prepare('DELETE FROM menu_plans WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
