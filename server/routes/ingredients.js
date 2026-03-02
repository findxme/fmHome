import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取所有食材
router.get(async (req, res) => {
  try {
    const { category, search } = req.query;
    let ingredients;

    if (search) {
      ingredients = await getDatabase().prepare(`
        SELECT * FROM ingredients
        WHERE name LIKE ?
        ORDER BY name ASC
      `).all(`%${search}%`);
    } else if (category) {
      ingredients = await getDatabase().prepare(`
        SELECT * FROM ingredients WHERE category = ?
        ORDER BY name ASC
      `).all(category);
    } else {
      ingredients = await getDatabase().prepare(`
        SELECT * FROM ingredients ORDER BY name ASC
      `).all();
    }

    res.json({ success: true, data: ingredients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取食材分类
router.get(async (req, res) => {
  try {
    const categories = await getDatabase().prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM ingredients
      GROUP BY category
      ORDER BY category
    `).all();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
