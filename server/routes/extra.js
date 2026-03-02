import express from 'express';
import { getDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// 获取所有待办
router.get('/todos', async (req, res) => {
  try {
    const todos = await getDatabase().prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 添加待办
router.post('/todos', async (req, res) => {
  try {
    const { content } = req.body;
    const id = randomUUID();
    await getDatabase().prepare('INSERT INTO todos (id, content) VALUES (?, ?)').run(id, content);
    const todo = await getDatabase().prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新待办
router.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, completed } = req.body;
    await getDatabase().prepare('UPDATE todos SET content = ?, completed = ? WHERE id = ?').run(content, completed ? 1 : 0, id);
    const todo = await getDatabase().prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除待办
router.delete('/todos/:id', async (req, res) => {
  try {
    await getDatabase().prepare('DELETE FROM todos WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取打卡记录
router.get('/checkins', async (req, res) => {
  try {
    const checkins = await getDatabase().prepare('SELECT * FROM checkins ORDER BY date DESC').all();
    res.json({ success: true, data: checkins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 打卡
router.post('/checkins', async (req, res) => {
  try {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    
    // 检查今天是否已打卡
    const existing = await db.prepare('SELECT * FROM checkins WHERE date = ?').get(today);
    if (existing) {
      return res.json({ success: true, data: existing });
    }
    
    // 获取昨天打卡记录计算连续天数
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastCheckin = await db.prepare('SELECT * FROM checkins WHERE date = ?').get(yesterday);
    const streak = lastCheckin ? lastCheckin.streak + 1 : 1;
    
    const id = randomUUID();
    await db.prepare('INSERT INTO checkins (id, date, streak) VALUES (?, ?, ?)').run(id, today, streak);
    const checkin = await db.prepare('SELECT * FROM checkins WHERE id = ?').get(id);
    res.json({ success: true, data: checkin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取购物模板
router.get('/shopping-templates', async (req, res) => {
  try {
    const templates = await getDatabase().prepare('SELECT * FROM shopping_templates ORDER BY created_at DESC').all();
    // 解析 JSON 字段
    templates.forEach(t => t.items = JSON.parse(t.items || '[]'));
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 保存购物模板
router.post('/shopping-templates', async (req, res) => {
  try {
    const { name, items } = req.body;
    const id = randomUUID();
    await getDatabase().prepare('INSERT INTO shopping_templates (id, name, items) VALUES (?, ?, ?)').run(id, name, JSON.stringify(items));
    const template = await getDatabase().prepare('SELECT * FROM shopping_templates WHERE id = ?').get(id);
    template.items = JSON.parse(template.items || '[]');
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 删除购物模板
router.delete('/shopping-templates/:id', async (req, res) => {
  try {
    await getDatabase().prepare('DELETE FROM shopping_templates WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取购买历史
router.get('/purchase-history', async (req, res) => {
  try {
    const history = await getDatabase().prepare('SELECT * FROM purchase_history ORDER BY purchased_at DESC LIMIT 30').all();
    history.forEach(h => h.items = JSON.parse(h.items || '[]'));
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 保存购买历史
router.post('/purchase-history', async (req, res) => {
  try {
    const { items } = req.body;
    const id = randomUUID();
    await getDatabase().prepare('INSERT INTO purchase_history (id, items) VALUES (?, ?)').run(id, JSON.stringify(items));
    const history = await getDatabase().prepare('SELECT * FROM purchase_history WHERE id = ?').get(id);
    history.items = JSON.parse(history.items || '[]');
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
