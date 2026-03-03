import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// 获取所有菜品
router.get('/', async (req, res) => {
  try {
    const { category, search, tag } = req.query;
    let dishes;

    if (search) {
      dishes = await getDatabase().prepare(`
        SELECT id, name, category, tags, difficulty, cooking_time, description, image_url
        FROM dishes
        WHERE name LIKE ? OR tags LIKE ?
        ORDER BY created_at DESC
      `).all(`%${search}%`, `%${search}%`);
    } else if (category) {
      dishes = await getDatabase().prepare(`
        SELECT id, name, category, tags, difficulty, cooking_time, description, image_url
        FROM dishes WHERE category = ?
        ORDER BY created_at DESC
      `).all(category);
    } else if (tag) {
      dishes = await getDatabase().prepare(`
        SELECT id, name, category, tags, difficulty, cooking_time, description, image_url
        FROM dishes WHERE tags LIKE ?
        ORDER BY created_at DESC
      `).all(`%${tag}%`);
    } else {
      dishes = await getDatabase().prepare(`
        SELECT id, name, category, tags, difficulty, cooking_time, description, image_url
        FROM dishes ORDER BY created_at DESC
      `).all();
    }

    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await getDatabase().prepare(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM dishes
      GROUP BY category
      ORDER BY COUNT(*) DESC
    `).all();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建新菜品（自定义菜品）
router.post('/', async (req, res) => {
  try {
    const {
      id,
      name,
      category,
      tags,
      image_url,
      difficulty,
      cooking_time,
      servings,
      description,
      ingredients,
      steps,
      tips
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ success: false, message: '菜品名称和分类不能为空' });
    }

    const dishId = id || `custom_${Date.now()}`;

    await getDatabase().prepare(`
      INSERT INTO dishes (id, name, category, tags, image_url, difficulty, cooking_time, servings, description, ingredients, steps, tips)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      dishId,
      name,
      category,
      tags || '',
      image_url || '',
      difficulty || '简单',
      cooking_time || '30分钟',
      servings || '2人份',
      description || '',
      JSON.stringify(ingredients || []),
      JSON.stringify(steps || []),
      JSON.stringify(tips || [])
    );

    const dish = await getDatabase().prepare('SELECT * FROM dishes WHERE id = ?').get(dishId);
    dish.ingredients = JSON.parse(dish.ingredients || '[]');
    dish.steps = JSON.parse(dish.steps || '[]');
    dish.tips = JSON.parse(dish.tips || '[]');

    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新菜品
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      tags,
      image_url,
      difficulty,
      cooking_time,
      servings,
      description,
      ingredients,
      steps,
      tips
    } = req.body;

    await getDatabase().prepare(`
      UPDATE dishes SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        tags = COALESCE(?, tags),
        image_url = COALESCE(?, image_url),
        difficulty = COALESCE(?, difficulty),
        cooking_time = COALESCE(?, cooking_time),
        servings = COALESCE(?, servings),
        description = COALESCE(?, description),
        ingredients = COALESCE(?, ingredients),
        steps = COALESCE(?, steps),
        tips = COALESCE(?, tips)
      WHERE id = ?
    `).run(
      name,
      category,
      tags,
      image_url,
      difficulty,
      cooking_time,
      servings,
      description,
      ingredients ? JSON.stringify(ingredients) : null,
      steps ? JSON.stringify(steps) : null,
      tips ? JSON.stringify(tips) : null,
      id
    );

    const dish = await getDatabase().prepare('SELECT * FROM dishes WHERE id = ?').get(id);
    dish.ingredients = JSON.parse(dish.ingredients || '[]');
    dish.steps = JSON.parse(dish.steps || '[]');
    dish.tips = JSON.parse(dish.tips || '[]');

    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除菜品
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await getDatabase().prepare('DELETE FROM dishes WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取根据食材搜索菜品
router.get('/recommend', async (req, res) => {
  try {
    const dishes = await getDatabase().prepare(`
      SELECT id, name, category, tags, difficulty, cooking_time, description, image_url
      FROM dishes
      ORDER BY RAND()
      LIMIT 6
    `).all();

    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 根据食材搜索菜品
router.get('/by-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.query;
    if (!ingredients) {
      return res.json({ success: true, data: [] });
    }

    const ingredientList = ingredients.split(',');
    let dishes = await getDatabase().prepare(`
      SELECT * FROM dishes ORDER BY created_at DESC
    `).all();

    // 过滤包含指定食材的菜品
    dishes = dishes.filter(dish => {
      const dishIngredients = JSON.parse(dish.ingredients || '[]');
      return ingredientList.some(ing =>
        dishIngredients.some(di => di.name.includes(ing))
      );
    });

    res.json({ success: true, data: dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取单个菜品详情（完整信息）- 必须放在最后
router.get('/:id', async (req, res) => {
  try {
    const dish = await getDatabase().prepare(`
      SELECT * FROM dishes WHERE id = ?
    `).get(req.params.id);

    if (!dish) {
      return res.status(404).json({ success: false, message: '菜品不存在' });
    }

    // 解析JSON字段
    dish.ingredients = JSON.parse(dish.ingredients || '[]');
    dish.steps = JSON.parse(dish.steps || '[]');
    dish.tips = JSON.parse(dish.tips || '[]');

    res.json({ success: true, data: dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
