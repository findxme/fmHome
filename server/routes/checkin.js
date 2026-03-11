import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取打卡记录和连续天数
router.get('/', async (req, res) => {
  const db = getDatabase();
  try {
    // 获取所有打卡记录
    const checkins = await db.prepare(`
      SELECT * FROM checkins
      ORDER BY checkin_date DESC
      LIMIT 30
    `).all();

    // 计算连续打卡天数
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 按日期排序（从最近到最远）
    const sortedDates = checkins
      .map(c => new Date(c.checkin_date))
      .sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      // 检查今天是否已打卡
      const todayStr = today.toISOString().split('T')[0];
      const lastCheckin = sortedDates[0];
      const lastCheckinStr = lastCheckin.toISOString().split('T')[0];

      if (lastCheckinStr === todayStr) {
        streak = 1;
        // 从昨天开始往前计算连续天数
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const expectedDate = new Date(yesterday);
          expectedDate.setDate(expectedDate.getDate() - (i - 1));

          const currentStr = currentDate.toISOString().split('T')[0];
          const expectedStr = expectedDate.toISOString().split('T')[0];

          if (currentStr === expectedStr) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        // 今天未打卡，从最后一次打卡开始计算
        const yesterday = new Date(lastCheckin);
        yesterday.setDate(yesterday.getDate() - 1);

        for (let i = 0; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          const expectedDate = new Date(yesterday);
          expectedDate.setDate(expectedDate.getDate() - i);

          const currentStr = currentDate.toISOString().split('T')[0];
          const expectedStr = expectedDate.toISOString().split('T')[0];

          if (currentStr === expectedStr) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        checkins,
        streak,
        todayChecked: checkins.some(c => c.checkin_date === today.toISOString().split('T')[0])
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 打卡
router.post('/', async (req, res) => {
  const db = getDatabase();
  const { date } = req.body;
  try {
    const today = date || new Date().toISOString().split('T')[0];

    // 检查今天是否已打卡
    const existing = await db.prepare(`
      SELECT * FROM checkins WHERE checkin_date = ?
    `).get(today);

    if (existing) {
      return res.json({ success: false, message: '今日已打卡' });
    }

    // 添加打卡记录
    await db.prepare(`
      INSERT INTO checkins (checkin_date) VALUES (?)
    `).run(today);

    // 重新获取打卡记录和连续天数
    const checkins = await db.prepare(`
      SELECT * FROM checkins
      ORDER BY checkin_date DESC
      LIMIT 30
    `).all();

    // 计算连续打卡天数
    let streak = 0;
    const sortedDates = checkins
      .map(c => new Date(c.checkin_date))
      .sort((a, b) => b - a);

    if (sortedDates.length > 0) {
      streak = 1;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        const expectedDate = new Date(yesterday);
        expectedDate.setDate(expectedDate.getDate() - (i - 1));

        const currentStr = currentDate.toISOString().split('T')[0];
        const expectedStr = expectedDate.toISOString().split('T')[0];

        if (currentStr === expectedStr) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      success: true,
      data: {
        checkins,
        streak,
        todayChecked: true
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除打卡记录
router.delete('/:date', async (req, res) => {
  const db = getDatabase();
  const { date } = req.params;
  try {
    await db.prepare('DELETE FROM checkins WHERE checkin_date = ?').run(date);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
