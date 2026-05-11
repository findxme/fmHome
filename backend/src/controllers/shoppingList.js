import { query, getConnection } from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

export async function getShoppingList(req, res) {
  const items = await query('SELECT * FROM shoppingList WHERE checked = 0 ORDER BY createdAt ASC');
  items.forEach(item => {
    item.recipeTitles = item.recipeTitles ? JSON.parse(item.recipeTitles) : [];
  });
  res.json({ success: true, data: items });
}

export async function buildShoppingList(req, res) {
  const { recipeIds } = req.body;
  
  const recipes = await query(
    'SELECT * FROM recipes WHERE id IN (' + recipeIds.map(() => '?').join(',') + ')',
    recipeIds
  );
  
  const ingredientMap = new Map();
  
  for (const recipe of recipes) {
    const ingredients = await query('SELECT * FROM ingredients WHERE recipeId = ?', [recipe.id]);
    for (const ingredient of ingredients) {
      const existing = ingredientMap.get(ingredient.name);
      if (existing) {
        if (!existing.amountText.includes(ingredient.amount)) {
          existing.amountText = `${existing.amountText} + ${ingredient.amount}`;
        }
        existing.recipeTitles.push(recipe.title);
      } else {
        ingredientMap.set(ingredient.name, {
          name: ingredient.name,
          amountText: ingredient.amount,
          recipeTitles: [recipe.title]
        });
      }
    }
  }
  
  const items = Array.from(ingredientMap.values());
  
  for (const item of items) {
    const existing = await query('SELECT * FROM shoppingList WHERE name = ? AND checked = 0', [item.name]);
    
    if (existing.length > 0) {
      const existingItem = existing[0];
      const existingRecipes = existingItem.recipeTitles ? JSON.parse(existingItem.recipeTitles) : [];
      const newRecipeTitles = [...new Set([...existingRecipes, ...item.recipeTitles])];
      await query(
        'UPDATE shoppingList SET amountText = ?, recipeTitles = ? WHERE id = ?',
        [item.amountText, JSON.stringify(newRecipeTitles), existingItem.id]
      );
    } else {
      await query(
        'INSERT INTO shoppingList (id, name, amountText, recipeTitles) VALUES (?, ?, ?, ?)',
        [uuidv4(), item.name, item.amountText, JSON.stringify(item.recipeTitles)]
      );
    }
  }
  
  const finalList = await query('SELECT * FROM shoppingList WHERE checked = 0 ORDER BY createdAt ASC');
  finalList.forEach(item => {
    item.recipeTitles = item.recipeTitles ? JSON.parse(item.recipeTitles) : [];
  });
  
  res.json({ success: true, data: finalList });
}

export async function updateShoppingItems(req, res) {
  const { items } = req.body;
  
  for (const item of items) {
    if (item.amountText) {
      await query('UPDATE shoppingList SET checked = ?, amountText = ? WHERE id = ?', [item.checked ? 1 : 0, item.amountText, item.id]);
    } else {
      await query('UPDATE shoppingList SET checked = ? WHERE id = ?', [item.checked ? 1 : 0, item.id]);
    }
  }
  
  res.json({ success: true, message: '更新成功' });
}

export async function addShoppingItem(req, res) {
  const { name, amountText } = req.body;
  
  const id = uuidv4();
  await query(
    'INSERT INTO shoppingList (id, name, amountText) VALUES (?, ?, ?)',
    [id, name, amountText]
  );
  
  const [item] = await query('SELECT * FROM shoppingList WHERE id = ?', [id]);
  item.recipeTitles = [];
  res.json({ success: true, data: item });
}

export async function deleteShoppingItem(req, res) {
  const { id } = req.params;
  
  await query('DELETE FROM shoppingList WHERE id = ?', [id]);
  
  res.json({ success: true, message: '删除成功' });
}

export async function completeShoppingList(req, res) {
  const { note } = req.body;
  
  const items = await query('SELECT * FROM shoppingList WHERE checked = 1');
  
  if (items.length === 0) {
    return res.json({ success: false, message: '没有已勾选的物品' });
  }
  
  const totalAmount = items.reduce((sum, item) => {
    const match = item.amountText?.match(/(\d+(?:\.\d+)?)/);
    return sum + (match ? parseFloat(match[1]) : 0);
  }, 0);
  
  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();
    
    const purchaseId = uuidv4();
    await connection.execute(
      'INSERT INTO purchases (id, storeName, purchaseDate, purchaseTime, totalAmount, sourceType, note) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [purchaseId, '购物清单', new Date().toISOString().split('T')[0], new Date().toTimeString().slice(0, 5), totalAmount, 'shopping_list', note || null]
    );
    
    for (const item of items) {
      await connection.execute(
        'INSERT INTO purchaseItems (id, purchaseId, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), purchaseId, item.name, 1, 0]
      );
    }
    
    await connection.execute('DELETE FROM shoppingList WHERE checked = 1');
    
    await connection.commit();
    
    const purchase = await query('SELECT * FROM purchases WHERE id = ?', [purchaseId]);
    purchase[0].items = await query('SELECT * FROM purchaseItems WHERE purchaseId = ?', [purchaseId]);
    purchase[0].date = purchase[0].purchaseDate;
    purchase[0].time = purchase[0].purchaseTime;
    
    res.json({ success: true, data: purchase[0] });
  } catch (error) {
    await connection.rollback();
    console.error('完成购物清单失败:', error);
    res.status(500).json({ success: false, message: '操作失败，请重试' });
  } finally {
    connection.release();
  }
}
