import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getRecipes(req, res) {
  const { filter, limit = 10, page = 1 } = req.query;
  
  let sql = 'SELECT * FROM recipes';
  let params = [];
  let whereClauses = [];
  
  if (filter) {
    if (filter === 'quick') {
      whereClauses.push('cookMinutes <= 20');
    } else if (filter === 'soup') {
      whereClauses.push('category = ?');
      params.push('汤类');
    } else if (filter === 'vegetable') {
      whereClauses.push('category = ?');
      params.push('素菜');
    } else if (filter === 'meat') {
      whereClauses.push('category IN (?)');
      params.push(['下饭菜', '硬菜']);
    } else if (filter === 'seafood') {
      whereClauses.push('tags LIKE ?');
      params.push('%海鲜%');
    } else if (filter === 'spicy') {
      whereClauses.push('(tags LIKE ? OR category LIKE ?)');
      params.push('%辣%', '%川菜%');
    } else if (filter === 'simple') {
      whereClauses.push('difficulty = ?');
      params.push('简单');
    } else {
      whereClauses.push('(category = ? OR tags LIKE ?)');
      params.push(filter, `%${filter}%`);
    }
  }
  
  if (whereClauses.length > 0) {
    sql += ' WHERE ' + whereClauses.join(' AND ');
  }
  
  const limitNum = parseInt(limit);
  const offsetNum = (parseInt(page) - 1) * limitNum;
  sql += ` ORDER BY createdAt DESC LIMIT ${limitNum} OFFSET ${offsetNum}`;
  
  const recipes = await query(sql, params);
  
  const recipesWithDetails = await Promise.all(recipes.map(async recipe => {
    recipe.tags = recipe.tags ? JSON.parse(recipe.tags) : [];
    recipe.ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [recipe.id]);
    recipe.steps = await query('SELECT * FROM steps WHERE recipeId = ? ORDER BY orderNum ASC', [recipe.id]);
    return recipe;
  }));
  
  let countSql = 'SELECT COUNT(*) as total FROM recipes';
  if (whereClauses.length > 0) {
    countSql += ' WHERE ' + whereClauses.join(' AND ');
  }
  const countResult = await query(countSql, params);
  
  res.json({ success: true, data: { list: recipesWithDetails, total: countResult[0].total, page: parseInt(page), limit: parseInt(limit) } });
}

export async function getRecipe(req, res) {
  const { id } = req.params;
  
  const recipes = await query('SELECT * FROM recipes WHERE id = ?', [id]);
  
  if (recipes.length === 0) {
    return res.status(404).json({ success: false, message: '菜谱不存在' });
  }
  
  const recipe = recipes[0];
  recipe.tags = recipe.tags ? JSON.parse(recipe.tags) : [];
  recipe.ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [id]);
  recipe.steps = await query('SELECT * FROM steps WHERE recipeId = ? ORDER BY orderNum ASC', [id]);
  
  res.json({ success: true, data: recipe });
}

export async function createRecipe(req, res) {
  const { title, category, difficulty, cookMinutes, cookTime, description, tags, imageUrl, tips, ingredients, steps } = req.body;
  
  const id = uuidv4();
  
  await query(
    'INSERT INTO recipes (id, title, category, difficulty, cookMinutes, cookTime, description, tags, imageUrl, tips) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, title, category, difficulty || '简单', cookMinutes, cookTime, description, tags ? JSON.stringify(tags) : null, imageUrl, tips]
  );
  
  if (ingredients && ingredients.length > 0) {
    for (const ing of ingredients) {
      await query(
        'INSERT INTO ingredients (id, recipeId, name, amount, category) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, ing.name, ing.amount, ing.category]
      );
    }
  }
  
  if (steps && steps.length > 0) {
    for (let i = 0; i < steps.length; i++) {
      await query(
        'INSERT INTO steps (id, recipeId, orderNum, title, content) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, i + 1, steps[i].title, steps[i].content]
      );
    }
  }
  
  const recipe = await getRecipeById(id);
  res.json({ success: true, data: recipe });
}

async function getRecipeById(id) {
  const recipes = await query('SELECT * FROM recipes WHERE id = ?', [id]);
  if (recipes.length === 0) return null;
  
  const recipe = recipes[0];
  recipe.tags = recipe.tags ? JSON.parse(recipe.tags) : [];
  recipe.ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [id]);
  recipe.steps = await query('SELECT * FROM steps WHERE recipeId = ? ORDER BY orderNum ASC', [id]);
  return recipe;
}

export async function updateRecipe(req, res) {
  const { id } = req.params;
  const { title, category, difficulty, cookMinutes, cookTime, description, tags, imageUrl, tips, ingredients, steps } = req.body;
  
  const recipes = await query('SELECT * FROM recipes WHERE id = ?', [id]);
  if (recipes.length === 0) {
    return res.status(404).json({ success: false, message: '菜谱不存在' });
  }
  
  await query(
    'UPDATE recipes SET title = ?, category = ?, difficulty = ?, cookMinutes = ?, cookTime = ?, description = ?, tags = ?, imageUrl = ?, tips = ? WHERE id = ?',
    [title, category, difficulty, cookMinutes, cookTime, description, tags ? JSON.stringify(tags) : null, imageUrl, tips, id]
  );
  
  if (ingredients !== undefined) {
    await query('DELETE FROM ingredients WHERE recipeId = ?', [id]);
    for (const ing of ingredients) {
      await query(
        'INSERT INTO ingredients (id, recipeId, name, amount, category) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, ing.name, ing.amount, ing.category]
      );
    }
  }
  
  if (steps !== undefined) {
    await query('DELETE FROM steps WHERE recipeId = ?', [id]);
    for (let i = 0; i < steps.length; i++) {
      await query(
        'INSERT INTO steps (id, recipeId, orderNum, title, content) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), id, i + 1, steps[i].title, steps[i].content]
      );
    }
  }
  
  const recipe = await getRecipeById(id);
  res.json({ success: true, data: recipe });
}

export async function deleteRecipe(req, res) {
  const { id } = req.params;
  
  const recipes = await query('SELECT * FROM recipes WHERE id = ?', [id]);
  if (recipes.length === 0) {
    return res.status(404).json({ success: false, message: '菜谱不存在' });
  }
  
  await query('DELETE FROM recipes WHERE id = ?', [id]);
  
  res.json({ success: true, message: '删除成功' });
}

export async function getRandomRecipe(req, res) {
  const countResult = await query('SELECT COUNT(*) as total FROM recipes');
  const total = countResult[0].total;
  
  if (total === 0) {
    return res.json({ success: false, message: '暂无菜谱' });
  }
  
  const randomOffset = Math.floor(Math.random() * total);
  const recipes = await query(`SELECT * FROM recipes LIMIT 1 OFFSET ${randomOffset}`);
  
  const recipe = recipes[0];
  recipe.tags = recipe.tags ? JSON.parse(recipe.tags) : [];
  recipe.ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [recipe.id]);
  
  res.json({ success: true, data: recipe });
}
