import { query } from './db.js';

async function clearDatabase() {
  try {
    await query('SET FOREIGN_KEY_CHECKS = 0');
    
    await query('DELETE FROM steps');
    console.log('清空 steps 表');
    
    await query('DELETE FROM ingredients');
    console.log('清空 ingredients 表');
    
    await query('DELETE FROM mealPicks');
    console.log('清空 mealPicks 表');
    
    await query('DELETE FROM shoppingList');
    console.log('清空 shoppingList 表');
    
    await query('DELETE FROM purchaseItems');
    console.log('清空 purchaseItems 表');
    
    await query('DELETE FROM purchases');
    console.log('清空 purchases 表');
    
    await query('DELETE FROM recipes');
    console.log('清空 recipes 表');
    
    await query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('数据库清空完成');
    process.exit(0);
  } catch (error) {
    console.error('清空数据库失败:', error);
    process.exit(1);
  }
}

clearDatabase();