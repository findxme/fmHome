/**
 * 购物清单管理路由
 * 
 * 功能说明：
 * - 获取购物清单（支持按日期查询）
 * - 创建新购物清单
 * - 更新购物清单（修改物品列表）
 * - 删除购物清单
 * - 更新物品采购状态
 * 
 * 数据表：shopping_lists
 * 物品存储：JSON 格式存储在 items 字段中
 */

import express from 'express';
import { getDatabase } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * 获取购物清单
 * 
 * 请求方式：GET /api/shopping-list
 * 查询参数：date（可选）- 指定日期，默认为最新一条
 * 返回：购物清单及其物品列表
 */
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

/**
 * 创建或更新购物清单
 * 
 * 请求方式：POST /api/shopping-list
 * 请求体：{ id?, date, items }
 * 逻辑：
 *   - 传入 id 时更新现有清单
 *   - 不传 id 时创建新清单
 *   - status 默认为 'pending'（待采购）
 */
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

/**
 * 删除购物清单
 * 
 * 请求方式：DELETE /api/shopping-list
 * 请求体：{ id } - 清单ID
 */
router.delete('/', async (req, res) => {
  try {
    await getDatabase().prepare('DELETE FROM shopping_lists WHERE id = ?').run(req.body.id);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 更新购物清单中的物品列表或状态
 * 
 * 请求方式：PUT /api/shopping-list
 * 请求体：{ id, items }
 * 用途：标记物品为已采购、更新物品数量等
 */
router.put('/', async (req, res) => {
  try {
    const { id, items } = req.body;
    const db = getDatabase();

    await db.prepare(`
      UPDATE shopping_lists
      SET items = ?
      WHERE id = ?
    `).run(JSON.stringify(items), id);

    const updated = await db.prepare('SELECT * FROM shopping_lists WHERE id = ?').get(id);
    updated.items = JSON.parse(updated.items || '[]');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
