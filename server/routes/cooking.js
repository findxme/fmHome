import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取烹饪记录
router.get('/', async (req, res) => {
  const db = getDatabase();
  const { limit = 20 } = req.query;
  try {
    const records = await db.prepare(`
      SELECT * FROM cooking_records
      ORDER BY cooked_at DESC
      LIMIT ?
    `).all(parseInt(limit));
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取烹饪统计
router.get('/stats', async (req, res) => {
  const db = getDatabase();
  try {
    const totalCooks = await db.prepare('SELECT COUNT(*) as count FROM cooking_records').get();
    const avgRating = await db.prepare('SELECT AVG(rating) as avg FROM cooking_records WHERE rating IS NOT NULL').get();
    const recentCooks = await db.prepare(`
      SELECT DATE(cooked_at) as date, COUNT(*) as count
      FROM cooking_records
      WHERE cooked_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(cooked_at)
    `).all();

    // 获取用户等级
    const userLevel = await db.prepare('SELECT * FROM user_levels WHERE id = 1').get();

    res.json({
      success: true,
      data: {
        totalCooks: totalCooks.count,
        avgRating: avgRating.avg ? parseFloat(avgRating.avg.toFixed(1)) : 0,
        recentCooks,
        userLevel: userLevel || { level: 1, experience_points: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 记录烹饪
router.post('/', async (req, res) => {
  const db = getDatabase();
  const { dish_id, dish_name, rating, notes } = req.body;
  try {
    const stmt = await db.prepare(`
      INSERT INTO cooking_records (dish_id, dish_name, rating, notes)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(dish_id, dish_name, rating, notes);

    // 更新用户等级和经验
    await updateUserLevel(db);

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新用户等级
async function updateUserLevel(db) {
  const today = new Date().toISOString().split('T')[0];

  // 获取或创建用户等级记录
  let userLevel = await db.prepare('SELECT * FROM user_levels WHERE id = 1').get();

  if (!userLevel) {
    await db.prepare('INSERT INTO user_levels (id, level, experience_points, total_cooks, consecutive_days, last_cook_date) VALUES (1, 1, 0, 0, 0, ?)').run(today);
    userLevel = { level: 1, experience_points: 0, total_cooks: 0, consecutive_days: 0, last_cook_date: today };
  }

  // 增加经验值和烹饪次数
  const newExp = userLevel.experience_points + 10;
  const newTotalCooks = userLevel.total_cooks + 1;

  // 计算连续天数
  let newConsecutiveDays = userLevel.consecutive_days;
  if (userLevel.last_cook_date) {
    const lastDate = new Date(userLevel.last_cook_date);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newConsecutiveDays += 1;
    } else if (diffDays > 1) {
      newConsecutiveDays = 1;
    }
  }

  // 计算等级
  let newLevel = 1;
  if (newTotalCooks >= 100) newLevel = 6;
  else if (newTotalCooks >= 50) newLevel = 5;
  else if (newTotalCooks >= 30) newLevel = 4;
  else if (newTotalCooks >= 15) newLevel = 3;
  else if (newTotalCooks >= 5) newLevel = 2;

  await db.prepare(`
    UPDATE user_levels
    SET level = ?, experience_points = ?, total_cooks = ?, consecutive_days = ?, last_cook_date = ?
    WHERE id = 1
  `).run(newLevel, newExp, newTotalCooks, newConsecutiveDays, today);
}

export default router;
