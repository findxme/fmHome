import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取用户偏好
router.get('/', async (req, res) => {
  try {
    const prefs = await getDatabase().prepare('SELECT * FROM user_preferences WHERE id = 1').get();
    
    if (!prefs) {
      // 创建默认偏好
      await getDatabase().prepare(`
        INSERT INTO user_preferences (id, taste_preference, difficulty_preference)
        VALUES (1, '不限', '不限')
      `).run();
      
      return res.json({ 
        success: true, 
        data: {
          taste_preference: '不限',
          difficulty_preference: '不限',
          preferred_tags: '',
          allergies: ''
        }
      });
    }
    
    res.json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新用户偏好
router.put('/', async (req, res) => {
  try {
    const { taste_preference, difficulty_preference, preferred_tags, allergies } = req.body;
    
    // 检查是否存在
    const existing = await getDatabase().prepare('SELECT id FROM user_preferences WHERE id = 1').get();
    
    if (existing) {
      await getDatabase().prepare(`
        UPDATE user_preferences SET
          taste_preference = COALESCE(?, taste_preference),
          difficulty_preference = COALESCE(?, difficulty_preference),
          preferred_tags = COALESCE(?, preferred_tags),
          allergies = COALESCE(?, allergies)
        WHERE id = 1
      `).run(taste_preference, difficulty_preference, preferred_tags, allergies);
    } else {
      await getDatabase().prepare(`
        INSERT INTO user_preferences (id, taste_preference, difficulty_preference, preferred_tags, allergies)
        VALUES (1, ?, ?, ?, ?)
      `).run(
        taste_preference || '不限',
        difficulty_preference || '不限',
        preferred_tags || '',
        allergies || ''
      );
    }
    
    const prefs = await getDatabase().prepare('SELECT * FROM user_preferences WHERE id = 1').get();
    res.json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
