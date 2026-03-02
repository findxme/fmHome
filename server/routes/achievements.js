import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 成就定义数据
const achievements = [
  { id: 'first_cook', name: '初试身手', description: '完成首次烹饪', icon: '🍳', category: 'special', requirement: 1, reward: 10 },
  { id: 'cook_5', name: '小试牛刀', description: '累计烹饪5次', icon: '👨‍🍳', category: 'count', requirement: 5, reward: 20 },
  { id: 'cook_15', name: '家常能手', description: '累计烹饪15次', icon: '🏅', category: 'count', requirement: 15, reward: 30 },
  { id: 'cook_30', name: '厨房老手', description: '累计烹饪30次', icon: '🎖️', category: 'count', requirement: 30, reward: 50 },
  { id: 'cook_50', name: '烹饪达人', description: '累计烹饪50次', icon: '🥇', category: 'count', requirement: 50, reward: 80 },
  { id: 'cook_100', name: '米其林大厨', description: '累计烹饪100次', icon: '👑', category: 'count', requirement: 100, reward: 100 },
  { id: 'streak_3', name: '三天打鱼', description: '连续3天烹饪', icon: '🔥', category: 'streak', requirement: 3, reward: 15 },
  { id: 'streak_7', name: '一周坚持', description: '连续7天烹饪', icon: '💪', category: 'streak', requirement: 7, reward: 25 },
  { id: 'streak_14', name: '两周不懈', description: '连续14天烹饪', icon: '🌟', category: 'streak', requirement: 14, reward: 40 },
  { id: 'streak_30', name: '月度厨神', description: '连续30天烹饪', icon: '🏆', category: 'streak', requirement: 30, reward: 80 },
  { id: 'favorite_10', name: '收藏达人', description: '收藏10道菜谱', icon: '❤️', category: 'special', requirement: 10, reward: 20 },
  { id: 'rating_5', name: '五分好评', description: '给出5次5星评价', icon: '⭐', category: 'special', requirement: 5, reward: 15 },
];

// 获取所有成就定义
router.get(async (req, res) => {
  res.json({ success: true, data: achievements });
});

// 获取用户成就进度
router.get(async (req, res) => {
  const db = getDatabase();
  try {
    const userAchievements = await db.prepare('SELECT * FROM user_achievements').all();
    const userLevel = await db.prepare('SELECT * FROM user_levels WHERE id = 1').get();

    // 合并成就数据
    const result = achievements.map(achievement => {
      const userProgress = userAchievements.find(u => u.achievement_id === achievement.id);
      return {
        ...achievement,
        progress: userProgress ? userProgress.progress : 0,
        is_unlocked: userProgress ? userProgress.is_unlocked === 1 : false,
        unlocked_at: userProgress ? userProgress.unlocked_at : null
      };
    });

    res.json({
      success: true,
      data: {
        achievements: result,
        level: userLevel || { level: 1, experience_points: 0, total_cooks: 0, consecutive_days: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 检查并更新成就状态
router.post(async (req, res) => {
  const db = getDatabase();
  try {
    const stats = await db.prepare('SELECT COUNT(*) as totalCooks FROM cooking_records').get();
    const userLevel = await db.prepare('SELECT * FROM user_levels WHERE id = 1').get();
    const favorites = await db.prepare('SELECT COUNT(*) as count FROM dish_favorites').get();

    const userStats = {
      totalCooks: stats.totalCooks,
      consecutiveDays: userLevel?.consecutive_days || 0,
      favoritesCount: favorites.count
    };

    const newlyUnlocked = [];

    achievements.forEach(achievement => {
      let progress = 0;

      if (achievement.category === 'count') {
        progress = userStats.totalCooks;
      } else if (achievement.category === 'streak') {
        progress = userStats.consecutiveDays;
      } else if (achievement.category === 'special') {
        if (achievement.id === 'favorite_10') {
          progress = userStats.favoritesCount;
        } else if (achievement.id === 'first_cook') {
          progress = userStats.totalCooks > 0 ? 1 : 0;
        }
      }

      const existing = await db.prepare('SELECT * FROM user_achievements WHERE achievement_id = ?').get(achievement.id);

      if (progress >= achievement.requirement) {
        if (!existing) {
          db.prepare('INSERT INTO user_achievements (achievement_id, progress, is_unlocked, unlocked_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)')
            .run(achievement.id, progress);
          newlyUnlocked.push(achievement);
        } else if (!existing.is_unlocked) {
          db.prepare('UPDATE user_achievements SET is_unlocked = 1, unlocked_at = CURRENT_TIMESTAMP WHERE achievement_id = ?')
            .run(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }

      if (!existing) {
        db.prepare('INSERT INTO user_achievements (achievement_id, progress, is_unlocked) VALUES (?, ?, 0)')
          .run(achievement.id, progress);
      } else if (progress > existing.progress) {
        db.prepare('UPDATE user_achievements SET progress = ? WHERE achievement_id = ?')
          .run(progress, achievement.id);
      }
    });

    res.json({ success: true, newlyUnlocked });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
