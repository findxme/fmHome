import Imap from 'imap';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';
import { getAIResponse } from '../routes/ai.js';

// QQ 邮件服务配置
class EmailService {
  constructor() {
    this.imap = null;
    this.transporter = null;
    this.lastCheckTime = null;
    this.processedEmails = new Set(); // 已处理邮件ID
  }

  // 初始化 IMAP 连接
  initImap(config) {
    this.imap = new Imap({
      user: config.email,
      password: config.password,
      host: config.imapHost || 'imap.qq.com',
      port: config.imapPort || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    this.imap.on('error', (err) => {
      console.error('IMAP 连接错误:', err.message);
    });
  }

  // 初始化 SMTP 发送邮件
  initTransporter(config) {
    this.transporter = nodemailer.createTransport({
      host: config.smtpHost || 'smtp.qq.com',
      port: config.smtpPort || 465,
      secure: true,
      auth: {
        user: config.email,
        pass: config.password
      }
    });
  }

  // 初始化服务
  init(config) {
    this.initImap(config);
    this.initTransporter(config);
  }

  // 检查新邮件
  checkEmails() {
    return new Promise((resolve, reject) => {
      if (!this.imap) {
        return reject(new Error('邮件服务未初始化'));
      }

      this.imap.openBox('INBOX', true, (err, box) => {
        if (err) return reject(err);

        // 获取今天和昨天的邮件
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const searchCriteria = ['ALL', ['SINCE', today.toISOString()]];

        this.imap.search(searchCriteria, async (err, results) => {
          if (err) return reject(err);

          if (results.length === 0) {
            return resolve({ success: true, emails: [], processed: 0, replied: 0 });
          }

          // 获取最新邮件
          const fetch = this.imap.fetch(results.slice(-10), {
            bodies: '',
            markSeen: false
          });

          const emails = [];
          const toProcess = [];

          fetch.on('message', (msg) => {
            let emailData = { headers: {} };

            msg.on('body', async (stream) => {
              try {
                const parsed = await simpleParser(stream);
                emailData = {
                  id: parsed.messageId,
                  from: parsed.from?.value?.[0]?.address,
                  fromName: parsed.from?.value?.[0]?.name,
                  subject: parsed.subject,
                  text: parsed.text,
                  html: parsed.html,
                  date: parsed.date
                };

                // 检查是否已处理
                if (!this.processedEmails.has(emailData.id)) {
                  toProcess.push(emailData);
                }
                emails.push(emailData);
              } catch (e) {
                console.error('解析邮件错误:', e.message);
              }
            });
          });

          fetch.on('end', () => {
            resolve({
              success: true,
              emails: emails.reverse(),
              toProcess: toProcess.reverse(),
              processed: this.processedEmails.size,
              total: results.length
            });
          });
        });
      });
    });
  }

  // 使用 AI 回复邮件
  async replyToEmail(email, aiPrompt) {
    if (!this.transporter) {
      return { success: false, message: '邮件服务未初始化' };
    }

    try {
      // 调用 AI 获取回复内容
      const prompt = aiPrompt || `用户发送了一封邮件，主题是"${email.subject}"，内容如下：\n${email.text}\n\n请以家庭点餐系统助手的身份，用友好、简洁的方式回复这封邮件。可以适当推荐菜品或菜单。`;

      const aiResult = await getAIResponse(prompt);

      if (!aiResult.success) {
        return { success: false, message: 'AI 回复失败: ' + aiResult.message };
      }

      const replyText = aiResult.data;

      // 发送回复邮件
      const info = await this.transporter.sendMail({
        from: `"家庭点餐系统" <${process.env.EMAIL_USER}>`,
        to: email.from,
        subject: `Re: ${email.subject}`,
        text: replyText,
        html: `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
          <p>您好${email.fromName ? ' ' + email.fromName : ''}，</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
            ${replyText.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; font-size: 12px;">
            ---<br>
            此邮件由家庭点餐系统自动回复
          </p>
        </div>`
      });

      // 标记为已处理
      this.processedEmails.add(email.id);

      return {
        success: true,
        message: '回复发送成功',
        replyId: info.messageId,
        replyText
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // 批量处理并回复邮件
  async processAndReply(aiPrompt) {
    const checkResult = await this.checkEmails();

    if (!checkResult.success || checkResult.toProcess.length === 0) {
      return checkResult;
    }

    const results = {
      success: true,
      emails: checkResult.emails,
      processed: checkResult.toProcess.length,
      replies: []
    };

    // 逐个回复
    for (const email of checkResult.toProcess) {
      const replyResult = await this.replyToEmail(email, aiPrompt);
      results.replies.push({
        emailId: email.id,
        from: email.from,
        subject: email.subject,
        ...replyResult
      });
    }

    return results;
  }

  // 关闭连接
  close() {
    if (this.imap) {
      this.imap.end();
    }
  }
}

// 导出单例
export default new EmailService();
