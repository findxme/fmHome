import express from 'express';
import emailService from '../services/email.js';

const router = express.Router();

// 检查邮件服务状态
router.get('/status', (req, res) => {
  const isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
  res.json({
    success: true,
    data: {
      configured: isConfigured,
      email: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{2}).*(@.*)/, '$1***$2') : null,
      processed: emailService.processedEmails?.size || 0
    }
  });
});

// 初始化邮件服务
router.post('/init', (req, res) => {
  try {
    const { email, password, imapHost, imapPort, smtpHost, smtpPort } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: '邮箱和密码不能为空' });
    }

    // 保存到环境变量（临时）
    process.env.EMAIL_USER = email;
    process.env.EMAIL_PASSWORD = password;

    // 初始化邮件服务
    emailService.init({
      email,
      password,
      imapHost,
      imapPort,
      smtpHost,
      smtpPort
    });

    res.json({ success: true, message: '邮件服务初始化成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 检查新邮件（不回复）
router.post('/check', async (req, res) => {
  try {
    const result = await emailService.checkEmails();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 检查并自动回复邮件
router.post('/check-and-reply', async (req, res) => {
  try {
    const { prompt } = req.body;
    const result = await emailService.processAndReply(prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 单独回复某封邮件
router.post('/reply', async (req, res) => {
  try {
    const { emailId, from, subject, text, prompt } = req.body;

    if (!from || !subject) {
      return res.status(400).json({ success: false, message: '邮件信息不完整' });
    }

    const email = { id: emailId, from, subject, text };
    const result = await emailService.replyToEmail(email, prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取已处理邮件数量
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      processedCount: emailService.processedEmails?.size || 0
    }
  });
});

// 清除已处理记录
router.post('/reset', (req, res) => {
  emailService.processedEmails.clear();
  res.json({ success: true, message: '已清除处理记录' });
});

export default router;
