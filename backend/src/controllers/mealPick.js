import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getMealPicks(req, res) {
  const today = new Date().toISOString().split('T')[0];
  
  const mealPicks = await query(
    'SELECT * FROM mealPicks WHERE pickedDate = ? AND status = ?',
    [today, 'active']
  );
  
  const picksWithRecipe = await Promise.all(mealPicks.map(async pick => {
    const recipes = await query('SELECT * FROM recipes WHERE id = ?', [pick.recipeId]);
    if (recipes.length > 0) {
      const recipe = recipes[0];
      recipe.tags = recipe.tags ? JSON.parse(recipe.tags) : [];
      recipe.ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [recipe.id]);
      pick.recipe = recipe;
    }
    return pick;
  }));
  
  res.json({ success: true, data: picksWithRecipe });
}

export async function addMealPick(req, res) {
  const { recipeId, recipeTitle } = req.body;
  
  const today = new Date().toISOString().split('T')[0];
  
  const existing = await query(
    'SELECT * FROM mealPicks WHERE recipeId = ? AND pickedDate = ?',
    [recipeId, today]
  );
  
  if (existing.length > 0) {
    return res.json({ success: false, message: '今天已经选过这个菜了' });
  }
  
  const id = uuidv4();
  await query(
    'INSERT INTO mealPicks (id, recipeId, recipeTitle, pickedDate) VALUES (?, ?, ?, ?)',
    [id, recipeId, recipeTitle, today]
  );
  
  const [mealPick] = await query('SELECT * FROM mealPicks WHERE id = ?', [id]);
  res.json({ success: true, data: mealPick });
}

export async function toggleMealPick(req, res) {
  const { id } = req.params;
  
  const mealPicks = await query('SELECT * FROM mealPicks WHERE id = ?', [id]);
  if (mealPicks.length === 0) {
    return res.status(404).json({ success: false, message: '记录不存在' });
  }
  
  const currentStatus = mealPicks[0].status;
  const newStatus = currentStatus === 'active' ? 'completed' : 'active';
  
  await query('UPDATE mealPicks SET status = ? WHERE id = ?', [newStatus, id]);
  
  const [updated] = await query('SELECT * FROM mealPicks WHERE id = ?', [id]);
  res.json({ success: true, data: updated });
}

export async function clearMealPicks(req, res) {
  const today = new Date().toISOString().split('T')[0];
  
  await query('DELETE FROM mealPicks WHERE pickedDate = ?', [today]);
  
  res.json({ success: true, message: '已清空今日菜单' });
}
