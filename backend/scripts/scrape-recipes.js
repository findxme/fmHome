import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

const db = mysql.createPool({
  host: '8.140.209.138',
  port: 9000,
  user: 'root',
  password: '123456',
  database: 'fmHome',
  waitForConnections: true,
  connectionLimit: 10,
});

async function query(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

const BASE_URL = 'https://home.meishichina.com';

const CATEGORIES = [
  { name: '下饭菜', filter: 'xiafancai' },
  { name: '汤类', filter: 'tang' },
  { name: '素菜', filter: 'scai' },
  { name: '快手菜', filter: 'kuaishoucai' },
  { name: '凉菜', filter: 'liangcai' },
  { name: '烘焙', filter: 'hongbei' },
  { name: '海鲜', filter: 'haixian' },
  { name: '川菜', filter: 'chuancai' },
];

const DIFFICULTY_MAP = {
  '新手': '简单',
  '入门': '简单',
  '普通': '中等',
  '进阶': '中等',
  '高手': '困难',
  '大厨': '困难',
};

function parseDifficulty(text) {
  if (!text) return '中等';
  for (const [key, value] of Object.entries(DIFFICULTY_MAP)) {
    if (text.includes(key)) return value;
  }
  return '中等';
}

function parseCookTime(text) {
  if (!text) return { minutes: 30, display: '30分钟' };
  const match = text.match(/(\d+)/);
  if (match) {
    const minutes = parseInt(match[1]);
    return {
      minutes,
      display: minutes <= 20 ? '20分钟' : minutes <= 30 ? '30分钟' : minutes <= 60 ? '1小时' : '2小时'
    };
  }
  return { minutes: 30, display: '30分钟' };
}

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      timeout: 15000,
    });
    if (!response.ok) return null;
    const html = await response.text();
    return cheerio.load(html);
  } catch (e) {
    console.error(`  获取页面失败: ${url}`, e.message);
    return null;
  }
}

async function getRecipeListUrls(page = 1) {
  const url = `${BASE_URL}/recipe-index.html?page=${page}`;
  const $ = await fetchPage(url);
  if (!$) return [];
  
  const urls = [];
  $('a[href*="/recipe-show-"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/recipe-show-')) {
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      urls.push(fullUrl);
    }
  });
  return [...new Set(urls)];
}

async function getRecipeDetail(url) {
  const $ = await fetchPage(url);
  if (!$) return null;
  
  const title = $('h1.recipe-title, .recipe-name, .title').first().text().trim();
  if (!title) return null;
  
  const desc = $('meta[name="description"]').attr('content') || '';
  const descText = desc.split('-')[0].trim();
  
  const imageUrl = $('.recipe-img img, .recipe-photo img, .detail-img img').first().attr('src') || '';
  
  const metaText = $('.recipe-meta, .recipe-info, .detail-info').text() || '';
  const cookTime = parseCookTime(metaText);
  const difficulty = parseDifficulty(metaText);
  
  const ingredients = [];
  $('.ingredient-list li, .recipe-ingredients li, .material-list li, .ingredients li').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 1) {
      const nameMatch = text.match(/^([^\d]+?)(?:\s*[:：]|\s|$)/);
      const amountMatch = text.match(/(\d+\.?\d*\s*(?:g|ml|勺|个|根|块|适量|少许|份|袋|包|只|条|个|片|瓣|根|节|把))/);
      
      if (nameMatch && nameMatch[1].trim()) {
        ingredients.push({
          name: nameMatch[1].trim(),
          amount: amountMatch ? amountMatch[1].trim() : '适量',
          category: '主料'
        });
      }
    }
  });
  
  const steps = [];
  $('.step-list li, .recipe-steps li, .steps li, .detail-step').each((i, el) => {
    const titleEl = $(el).find('.step-title, .title, strong, b').first();
    const contentEl = $(el).find('.step-content, .content, p').first();
    
    const stepTitle = titleEl.text().trim().replace(/^步骤\s*\d*[:：]?\s*/i, '') || `步骤${i + 1}`;
    const stepContent = contentEl.text().trim() || $(el).text().trim();
    
    if (stepContent && stepContent.length > 2) {
      steps.push({
        title: stepTitle,
        content: stepContent
      });
    }
  });
  
  if (steps.length === 0 && title) {
    const stepTexts = $('.recipe-detail, .detail-content, .content, .recipe-text').text().trim();
    if (stepTexts) {
      const sentences = stepTexts.split(/[。；；.]/).filter(s => s.trim().length > 5);
      sentences.forEach((s, i) => {
        steps.push({
          title: `步骤${i + 1}`,
          content: s.trim()
        });
      });
    }
  }
  
  const tags = [];
  $('.recipe-tag, .tag, .tags').each((i, el) => {
    const tag = $(el).text().trim();
    if (tag && tag.length > 1 && tag.length < 10) {
      tags.push(tag);
    }
  });
  
  let category = '下饭菜';
  for (const cat of CATEGORIES) {
    if (url.includes(cat.filter) || title.includes(cat.name) || tags.some(t => t.includes(cat.name))) {
      category = cat.name;
      break;
    }
  }
  
  return {
    title,
    category,
    difficulty,
    cookMinutes: cookTime.minutes,
    cookTime: cookTime.display,
    description: descText || `${title}的做法，简单美味。`,
    tags: tags.length > 0 ? tags.slice(0, 3) : [category],
    imageUrl: imageUrl || `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(title + '美食照片，高清，诱人')}&image_size=portrait_4_3`,
    tips: '',
    ingredients,
    steps
  };
}

async function insertRecipe(recipe) {
  if (!recipe.title || recipe.steps.length === 0) return false;
  
  const existing = await query('SELECT id FROM recipes WHERE title = ?', [recipe.title]);
  if (existing.length > 0) {
    console.log(`  已存在，跳过: ${recipe.title}`);
    return false;
  }
  
  const id = uuidv4();
  
  await query(
    `INSERT INTO recipes (id, title, category, difficulty, cookMinutes, cookTime, description, tags, imageUrl, tips, sourceType) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scraped')`,
    [id, recipe.title, recipe.category, recipe.difficulty, recipe.cookMinutes, recipe.cookTime, 
     recipe.description, JSON.stringify(recipe.tags), recipe.imageUrl, recipe.tips]
  );
  
  for (const ing of recipe.ingredients) {
    await query(
      'INSERT INTO ingredients (id, recipeId, name, amount, category) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), id, ing.name, ing.amount, ing.category]
    );
  }
  
  for (let i = 0; i < recipe.steps.length; i++) {
    await query(
      'INSERT INTO steps (id, recipeId, orderNum, title, content) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), id, i + 1, recipe.steps[i].title, recipe.steps[i].content]
    );
  }
  
  return true;
}

async function main() {
  console.log('开始抓取菜谱数据...');
  console.log('目标: 50道菜谱\n');
  
  let allUrls = [];
  for (let page = 1; page <= 10; page++) {
    console.log(`正在获取第 ${page} 页菜谱列表...`);
    const urls = await getRecipeListUrls(page);
    console.log(`  找到 ${urls.length} 个菜谱链接`);
    allUrls = allUrls.concat(urls);
    if (urls.length === 0) break;
    await new Promise(r => setTimeout(r, 1000));
  }
  
  allUrls = [...new Set(allUrls)];
  console.log(`\n共找到 ${allUrls.length} 个唯一菜谱链接`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < allUrls.length && successCount < 50; i++) {
    const url = allUrls[i];
    console.log(`\n[${i + 1}/${allUrls.length}] 正在抓取: ${url}`);
    
    try {
      const recipe = await getRecipeDetail(url);
      if (recipe) {
        console.log(`  标题: ${recipe.title}`);
        console.log(`  食材: ${recipe.ingredients.length} 个`);
        console.log(`  步骤: ${recipe.steps.length} 个`);
        
        const inserted = await insertRecipe(recipe);
        if (inserted) {
          successCount++;
          console.log(`  ✓ 已添加 (${successCount}/50)`);
        }
      } else {
        failCount++;
        console.log('  ✗ 解析失败');
      }
    } catch (e) {
      failCount++;
      console.log(`  ✗ 错误: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n\n抓取完成!`);
  console.log(`成功添加: ${successCount} 道菜谱`);
  console.log(`失败: ${failCount} 道`);
  
  const total = await query('SELECT COUNT(*) as total FROM recipes');
  console.log(`数据库中共有: ${total[0].total} 道菜谱`);
  
  await db.end();
}

main().catch(console.error);
