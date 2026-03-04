/**
 * 家庭管理路由
 * 
 * 功能说明：
 * - 创建家庭（每个用户只能创建一个家庭）
 * - 通过邀请码加入已有家庭
 * - 获取当前家庭信息及成员列表
 * - 更新家庭名称
 * - 刷新邀请码（邀请码7天后过期）
 * - 家庭成员管理（添加、删除成员）
 * 
 * 数据表：
 *   - families：家庭基本信息
 *   - family_members：家庭成员列表
 * 
 * 邀请码机制：
 *   - 6位随机字母数字组合
 *   - 有效期7天
 *   - 可手动刷新重置
 */

import express from 'express';
import { getDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

/**
 * 创建新家庭
 * 
 * 请求方式：POST /api/family/create
 * 请求体：{ name } - 家庭名称
 * 限制：每个用户只能创建一个家庭
 * 返回：家庭信息及初始成员列表
 * 
 * 自动操作：
 *   - 生成唯一家庭ID
 *   - 生成6位邀请码（有效期7天）
 *   - 将创建者添加为管理员（role: admin）
 */
router.post('/create', async (req, res) => {
  const db = getDatabase();
  const { name } = req.body;

  try {
    // 检查是否已有家庭
    const existing = await db.prepare('SELECT * FROM families LIMIT 1').get();

    if (existing) {
      return res.json({ success: false, error: '家庭已存在', family: existing });
    }

    const familyId = randomUUID();
    const inviteCode = generateInviteCode();

    await db.prepare(`
      INSERT INTO families (id, name, invite_code, invite_expires_at)
      VALUES (?, ?, ?, datetime('now', '+7 days'))
    `).run(familyId, name, inviteCode);

    // 添加创建者为管理员
    await db.prepare(`
      INSERT INTO family_members (family_id, member_name, role)
      VALUES (?, ?, 'admin')
    `).run(familyId, '我');

    const family = await db.prepare('SELECT * FROM families WHERE id = ?').get(familyId);
    const members = await db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(familyId);

    res.json({ success: true, family, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 加入已有家庭
 * 
 * 请求方式：POST /api/family/join
 * 请求体：{ invite_code, member_name }
 * 验证：
 *   - 邀请码必须有效且未过期
 *   - 成员不能已是家庭成员
 * 返回：家庭信息及更新后的成员列表
 */
router.post('/join', async (req, res) => {
  const db = getDatabase();
  const { invite_code, member_name } = req.body;

  try {
    const family = await db.prepare(`
      SELECT * FROM families
      WHERE invite_code = ?
      AND invite_expires_at > datetime('now')
    `).get(invite_code);

    if (!family) {
      return res.json({ success: false, error: '邀请码无效或已过期' });
    }

    // 检查是否已是成员
    const existing = await db.prepare(`
      SELECT * FROM family_members WHERE family_id = ? AND member_name = ?
    `).get(family.id, member_name);

    if (existing) {
      return res.json({ success: false, error: '你已经是家庭成员了' });
    }

    await db.prepare(`
      INSERT INTO family_members (family_id, member_name, role)
      VALUES (?, ?, 'member')
    `).run(family.id, member_name);

    const members = await db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(family.id);

    res.json({ success: true, family, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 获取当前家庭信息
 * 
 * 请求方式：GET /api/family
 * 返回：家庭信息及所有成员列表
 * 注意：只返回一个家庭（系统设计为单家庭模式）
 */
router.get('/', async (req, res) => {
  const db = getDatabase();
  try {
    const family = await db.prepare('SELECT * FROM families LIMIT 1').get();
    if (!family) {
      return res.json({ success: true, data: null });
    }
    const members = await db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(family.id);
    res.json({ success: true, data: { ...family, members } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 更新家庭名称
 * 
 * 请求方式：PUT /api/family
 * 请求体：{ name } - 新的家庭名称
 * 权限：家庭创建者或管理员
 */
router.put('/', async (req, res) => {
  const db = getDatabase();
  const { name } = req.body;
  try {
    await db.prepare('UPDATE families SET name = ? WHERE id = (SELECT id FROM families LIMIT 1)').run(name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 刷新邀请码
 * 
 * 请求方式：POST /api/family/refresh-code
 * 用途：生成新的邀请码，重置7天有效期
 * 返回：新的邀请码
 */
router.post('/refresh-code', async (req, res) => {
  const db = getDatabase();
  try {
    const newCode = generateInviteCode();
    await db.prepare(`
      UPDATE families
      SET invite_code = ?, invite_expires_at = datetime('now', '+7 days')
      WHERE id = (SELECT id FROM families LIMIT 1)
    `).run(newCode);
    res.json({ success: true, invite_code: newCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 移除家庭成员（废弃接口，保留兼容）
 * 
 * 请求方式：DELETE /api/family
 * 注意：请使用 DELETE /api/family/members/:id
 */
router.delete('/', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    await db.prepare('DELETE FROM family_members WHERE id = ? AND role != "admin"').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 添加家庭成员
 * 
 * 请求方式：POST /api/family/members
 * 请求体：{ member_name, title, avatar, color }
 * 限制：成员不能已存在于家庭中
 * 默认角色：member（普通成员）
 */
router.post('/members', async (req, res) => {
  const db = getDatabase();
  const { member_name, title, avatar, color } = req.body;

  try {
    // 获取当前家庭
    const family = await db.prepare('SELECT * FROM families LIMIT 1').get();
    if (!family) {
      return res.json({ success: false, error: '请先创建家庭' });
    }

    // 检查是否已是成员
    const existing = await db.prepare(`
      SELECT * FROM family_members WHERE family_id = ? AND member_name = ?
    `).get(family.id, member_name);

    if (existing) {
      return res.json({ success: false, error: '该成员已存在' });
    }

    await db.prepare(`
      INSERT INTO family_members (family_id, member_name, title, avatar, color, role)
      VALUES (?, ?, ?, ?, ?, 'member')
    `).run(family.id, member_name, title || '家庭成员', avatar || '😎', color || '#a7f3d0');

    const members = await db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(family.id);
    res.json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 删除家庭成员
 * 
 * 请求方式：DELETE /api/family/members/:id
 * 路径参数：id - 成员ID
 * 限制：不能删除管理员角色（role: admin）的成员
 * 返回：成功返回 true
 */
router.delete('/members/:id', async (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    await db.prepare('DELETE FROM family_members WHERE id = ? AND role != "admin"').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 生成邀请码
function generateInviteCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default router;
