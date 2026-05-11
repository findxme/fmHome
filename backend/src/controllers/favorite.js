import { query } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getFavorites(req, res) {
  const favorites = await query(
    `SELECT f.*, r.category, r.difficulty, r.cookTime, r.imageUrl, r.tags 
     FROM favorites f 
     LEFT JOIN recipes r ON f.recipeId = r.id 
     ORDER BY f.createdAt DESC`
  );
  
  const favoritesWithTags = favorites.map(f => ({
    ...f,
    tags: f.tags ? JSON.parse(f.tags) : []
  }));
  
  res.json({ success: true, data: favoritesWithTags });
}

export async function addFavorite(req, res) {
  const { recipeId, recipeTitle } = req.body;
  
  const existing = await query(
    'SELECT * FROM favorites WHERE recipeId = ?',
    [recipeId]
  );
  
  if (existing.length > 0) {
    return res.json({ success: false, message: '已经收藏过了' });
  }
  
  const id = uuidv4();
  await query(
    'INSERT INTO favorites (id, recipeId, recipeTitle) VALUES (?, ?, ?)',
    [id, recipeId, recipeTitle]
  );
  
  const [favorite] = await query('SELECT * FROM favorites WHERE id = ?', [id]);
  res.json({ success: true, data: favorite });
}

export async function removeFavorite(req, res) {
  const { recipeId } = req.params;
  
  await query('DELETE FROM favorites WHERE recipeId = ?', [recipeId]);
  
  res.json({ success: true, message: '已取消收藏' });
}

export async function checkFavorite(req, res) {
  const { recipeId } = req.params;
  
  const favorites = await query(
    'SELECT * FROM favorites WHERE recipeId = ?',
    [recipeId]
  );
  
  res.json({ success: true, isFavorite: favorites.length > 0 });
}