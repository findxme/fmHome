import express from 'express';
import { getDatabase } from '../database.js';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Claude AI 集成
const getAIResponse = async (prompt) => {
  const apiKey = process.env.CLAUDE_API_KEY;

  if (!apiKey) {
    return { success: false, message: 'API Key 未配置' };
  }

  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
      baseURL: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1',
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      system: '你是一个专业的家庭厨师助手，擅长根据用户需求推荐菜品、规划菜单、解答烹饪问题。请用简洁、实用的方式回复。',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // 从 content 数组中找到 text 类型的回复
    const textContent = response.content.find(c => c.type === 'text');
    const replyText = textContent ? textContent.text : '';
    return { success: true, data: replyText };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// 智能推荐菜品
router.post('/recommend', async (req, res) => {
  try {
    const { taste, difficulty, type, ingredients, count = 5 } = req.body;

    // 获取数据库中的菜品
    const db = getDatabase();
    let dishes = await db.prepare('SELECT * FROM dishes').all();

    // 基础筛选
    if (taste && taste !== '不限') {
      dishes = dishes.filter(d => {
        const tags = d.tags || '';
        if (taste === '辣') return tags.includes('辣');
        if (taste === '清淡') return !tags.includes('辣') && !tags.includes('红烧');
        if (taste === '甜') return tags.includes('糖醋') || tags.includes('可乐');
        return true;
      });
    }

    if (difficulty && difficulty !== '不限') {
      dishes = dishes.filter(d => d.difficulty === difficulty);
    }

    if (type) {
      dishes = dishes.filter(d => d.category === type);
    }

    // 随机返回指定数量
    const shuffled = dishes.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, count);

    res.json({ success: true, data: recommended });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI 菜单规划
router.post('/plan', async (req, res) => {
  try {
    const { days = 7, preferences } = req.body;

    const prompt = `请为一个${days}天的家庭菜单进行规划。
偏好：${JSON.stringify(preferences || {})}
请直接返回JSON格式的菜单计划，无需额外说明。
格式示例：
{
  "days": [
    {
      "day": "第1天",
      "breakfast": "早餐建议",
      "lunch": "午餐菜品",
      "dinner": "晚餐菜品",
      "notes": "备注"
    }
  ],
  "shoppingList": ["食材1", "食材2"]
}`;

    const result = await getAIResponse(prompt);

    if (!result.success) {
      return res.json({ success: true, data: generateDefaultPlan(days) });
    }

    // 尝试解析JSON
    try {
      const jsonMatch = result.data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const planData = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, data: planData });
      }
    } catch (e) {
      // 解析失败，返回默认方案
    }

    res.json({ success: true, data: generateDefaultPlan(days) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 烹饪问答
router.post('/chat', async (req, res) => {
  try {
    const { question, context } = req.body;

    const result = await getAIResponse(question);

    // 保存对话历史
    const db = getDatabase();
    db.prepare(`
      INSERT INTO ai_conversations (conversation_type, user_input, ai_response)
      VALUES (?, ?, ?)
    `).run('chat', question, result.data || result.message);

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 心情推荐
router.post('/mood', async (req, res) => {
  try {
    const { mood, excludeIngredients } = req.body;

    const moodMapping = {
      '开心': ['火锅', '烧烤', '大餐'],
      '难过': ['甜品', '蛋糕', '巧克力'],
      '压力大': ['清淡', '粥', '汤'],
      '疲惫': ['简单', '快手菜', '15分钟'],
      '无聊': ['新奇的', '创意', '特色']
    };

    const recommendedTags = moodMapping[mood] || [];

    const db = getDatabase();
    let dishes = await db.prepare('SELECT * FROM dishes').all();

    // 根据心情筛选
    if (recommendedTags.length > 0) {
      dishes = dishes.filter(d => {
        const tags = d.tags || '';
        return recommendedTags.some(tag => tags.includes(tag));
      });
    }

    // 随机返回
    const shuffled = dishes.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 5);

    res.json({
      success: true,
      data: {
        mood,
        recommendations: recommended,
        reason: getMoodReason(mood)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 季节推荐
router.get('/seasonal', async (req, res) => {
  try {
    const month = new Date().getMonth() + 1;

    const seasonalMapping = {
      spring: { months: [3, 4, 5], tags: ['清淡', '春季', '时蔬'], reason: '春天宜吃清淡爽口的菜品' },
      summer: { months: [6, 7, 8], tags: ['凉菜', '冷面', '沙拉'], reason: '夏天适合吃凉爽开胃的菜品' },
      autumn: { months: [9, 10, 11], tags: ['炖汤', '贴秋膘', '进补'], reason: '秋天适合温补润燥的菜品' },
      winter: { months: [12, 1, 2], tags: ['火锅', '炖菜', '热气'], reason: '冬天适合热气腾腾的暖胃菜品' }
    };

    let season = 'spring';
    if (month >= 3 && month <= 5) season = 'spring';
    else if (month >= 6 && month <= 8) season = 'summer';
    else if (month >= 9 && month <= 11) season = 'autumn';
    else season = 'winter';

    const config = seasonalMapping[season];

    const db = getDatabase();
    let dishes = await db.prepare('SELECT * FROM dishes').all();

    dishes = dishes.filter(d => {
      const tags = d.tags || '';
      return config.tags.some(tag => tags.includes(tag));
    });

    const shuffled = dishes.sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 5);

    res.json({
      success: true,
      data: {
        season,
        month,
        recommendations: recommended,
        reason: config.reason
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 随机推荐
router.post('/roll-dice', async (req, res) => {
  try {
    const { excludeDishes } = req.body;

    const db = getDatabase();
    let dishes = await db.prepare('SELECT * FROM dishes').all();

    // 排除已选择的
    if (excludeDishes && excludeDishes.length > 0) {
      dishes = dishes.filter(d => !excludeDishes.includes(d.id));
    }

    const shuffled = dishes.sort(() => 0.5 - Math.random());
    const result = shuffled[0];

    const reasons = [
      '缘分到了，就选它吧！',
      '今天天气不错，适合吃这个！',
      '大数据推荐：随机也是科学！',
      '跟着感觉走，不会错的~',
      '这道菜正在等你！'
    ];

    res.json({
      success: true,
      data: {
        dish: result,
        reason: reasons[Math.floor(Math.random() * reasons.length)]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 食材生成菜谱
router.post('/ingredient-recipe', async (req, res) => {
  try {
    const { ingredients, excludeIngredients } = req.body;

    const prompt = `我家里有以下食材：${ingredients.join(', ')}
    ${excludeIngredients ? `请排除以下食材：${excludeIngredients.join(', ')}` : ''}
    请根据这些食材推荐1-2道简单易做的家常菜。
    请返回JSON格式：
    {
      "recipes": [
        {
          "name": "菜名",
          "reason": "推荐理由",
          "difficulty": "难度",
          "time": "烹饪时间",
          "ingredients": ["需要的食材"],
          "steps": ["步骤1", "步骤2"]
        }
      ]
    }`;

    const result = await getAIResponse(prompt);

    if (!result.success) {
      return res.json({ success: false, message: result.message });
    }

    // 尝试解析JSON
    try {
      const jsonMatch = result.data.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recipeData = JSON.parse(jsonMatch[0]);
        return res.json({ success: true, data: recipeData });
      }
    } catch (e) {
      // 解析失败
    }

    res.json({ success: true, data: { recipes: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取心情选项
router.get('/mood-options', async (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'happy', name: '开心', emoji: '😊', icon: '🎉' },
      { id: 'sad', name: '难过', emoji: '😢', icon: '🍰' },
      { id: 'stressed', name: '压力大', emoji: '😰', icon: '🍵' },
      { id: 'tired', name: '疲惫', emoji: '😴', icon: '🍳' },
      { id: 'bored', name: '无聊', emoji: '😑', icon: '🎲' }
    ]
  });
});

// 获取心情推荐理由
function getMoodReason(mood) {
  const reasons = {
    '开心': '心情好当然要吃顿好的庆祝一下！',
    '难过': '吃点甜的心情会变好哦~',
    '压力大': '来点清淡的放松一下吧',
    '疲惫': '简单快手的菜最适合你了',
    '无聊': '来点新鲜的挑战一下味蕾！'
  };
  return reasons[mood] || '今天吃点好的！';
}

// 生成默认菜单计划
async function generateDefaultPlan(days) {
  const db = getDatabase();
  const dishes = await db.prepare('SELECT * FROM dishes').all();
  const categories = ['午餐', '晚餐'];

  const plan = {
    days: [],
    shoppingList: []
  };

  for (let i = 1; i <= days; i++) {
    const lunchDishes = dishes.filter(d => d.category === '午餐').sort(() => 0.5 - Math.random());
    const dinnerDishes = dishes.filter(d => d.category === '晚餐').sort(() => 0.5 - Math.random());

    plan.days.push({
      day: `第${i}天`,
      breakfast: '粥/牛奶+面包/中式早餐',
      lunch: lunchDishes[0]?.name || '番茄炒蛋',
      dinner: dinnerDishes[0]?.name || '红烧肉',
      notes: '注意营养均衡'
    });
  }

  return plan;
}

export { getAIResponse };
export default router;
