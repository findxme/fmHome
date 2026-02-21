import express from 'express';
import { getDatabase } from '../database.js';
import { randomUUID } from 'crypto';

const router = express.Router();

// 创建家庭
router.post('/create', (req, res) => {
  const db = getDatabase();
  const { name } = req.body;

  try {
    // 检查是否已有家庭
    const existing = db.prepare('SELECT * FROM families LIMIT 1').get();

    if (existing) {
      return res.json({ success: false, error: '家庭已存在', family: existing });
    }

    const familyId = randomUUID();
    const inviteCode = generateInviteCode();

    db.prepare(`
      INSERT INTO families (id, name, invite_code, invite_expires_at)
      VALUES (?, ?, ?, datetime('now', '+7 days'))
    `).run(familyId, name, inviteCode);

    // 添加创建者为管理员
    db.prepare(`
      INSERT INTO family_members (family_id, member_name, role)
      VALUES (?, ?, 'admin')
    `).run(familyId, '我');

    const family = db.prepare('SELECT * FROM families WHERE id = ?').get(familyId);
    const members = db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(familyId);

    res.json({ success: true, family, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 加入家庭
router.post('/join', (req, res) => {
  const db = getDatabase();
  const { invite_code, member_name } = req.body;

  try {
    const family = db.prepare(`
      SELECT * FROM families
      WHERE invite_code = ?
      AND invite_expires_at > datetime('now')
    `).get(invite_code);

    if (!family) {
      return res.json({ success: false, error: '邀请码无效或已过期' });
    }

    // 检查是否已是成员
    const existing = db.prepare(`
      SELECT * FROM family_members WHERE family_id = ? AND member_name = ?
    `).get(family.id, member_name);

    if (existing) {
      return res.json({ success: false, error: '你已经是家庭成员了' });
    }

    db.prepare(`
      INSERT INTO family_members (family_id, member_name, role)
      VALUES (?, ?, 'member')
    `).run(family.id, member_name);

    const members = db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(family.id);

    res.json({ success: true, family, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取家庭信息
router.get('/', (req, res) => {
  const db = getDatabase();
  try {
    const family = db.prepare('SELECT * FROM families LIMIT 1').get();
    if (!family) {
      return res.json({ success: true, data: null });
    }
    const members = db.prepare('SELECT * FROM family_members WHERE family_id = ?').all(family.id);
    res.json({ success: true, data: { ...family, members } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新家庭信息
router.put('/', (req, res) => {
  const db = getDatabase();
  const { name } = req.body;
  try {
    db.prepare('UPDATE families SET name = ? WHERE id = (SELECT id FROM families LIMIT 1)').run(name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 刷新邀请码
router.post('/refresh-code', (req, res) => {
  const db = getDatabase();
  try {
    const newCode = generateInviteCode();
    db.prepare(`
      UPDATE families
      SET invite_code = ?, invite_expires_at = datetime('now', '+7 days')
      WHERE id = (SELECT id FROM families LIMIT 1)
    `).run(newCode);
    res.json({ success: true, invite_code: newCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 移除家庭成员
router.delete('/members/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM family_members WHERE id = ? AND role != "admin"').run(id);
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
