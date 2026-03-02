import express from 'express';
import { getDatabase } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取购物清单
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let list;

    if (date) {
      list = await getDatabase().prepare(`
        SELECT * FROM shopping_lists WHERE date = ?
        ORDER BY created_at DESC
        LIMIT 1
      `).get(date);
    } else {
      list = await getDatabase().prepare(`
        SELECT * FROM shopping_lists
        ORDER BY created_at DESC
        LIMIT 1
      `).get();
    }

    if (list) {
      list.items = JSON.parse(list.items || '[]');
    }

    res.json({ success: true, data: list || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建/更新购物清单
router.post('/', async (req, res) => {
  try {
    const { id, date, items } = req.body;
    const db = getDatabase();

    if (id) {
      // 更新
      await db.prepare(`
        UPDATE shopping_lists
        SET items = ?, status = 'pending'
        WHERE id = ?
      `).run(JSON.stringify(items), id);

      const updated = await db.prepare('SELECT * FROM shopping_lists WHERE id = ?').get(id);
      updated.items = JSON.parse(updated.items || '[]');
      res.json({ success: true, data: updated });
    } else {
      // 创建
      const newId = uuidv4();
      await db.prepare(`
        INSERT INTO shopping_lists (id, date, items, status)
        VALUES (?, ?, ?, 'pending')
      `).run(newId, date || new Date().toISOString().split('T')[0], JSON.stringify(items || []));

      const newList = await db.prepare('SELECT * FROM shopping_lists WHERE id = ?').get(newId);
      newList.items = JSON.parse(newList.items || '[]');
      res.json({ success: true, data: newList });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除购物清单
router.delete('/', async (req, res) => {
  try {
    await getDatabase().prepare('DELETE FROM shopping_lists WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
