import mysql from 'mysql2/promise';
import { seedData } from './seedData.js';
import betterSqlite3 from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MySQL配置
const mysqlConfig = {
  host: '8.140.209.138',
  port: 9000,
  user: 'root',
  password: 'fm123',
  database: 'fm_home'
};

async function importData() {
  let mysqlConn;
  let sqliteDb;

  try {
    // 1. 读取SQLite数据
    console.log('📂 读取SQLite数据...');
    sqliteDb = betterSqlite3(path.join(__dirname, 'fmhome.db'));

    const dishes = sqliteDb.prepare('SELECT * FROM dishes').all();
    const ingredients = sqliteDb.prepare('SELECT * FROM ingredients').all();

    console.log(`📊 读取到 ${dishes.length} 道菜品, ${ingredients.length} 种食材`);

    // 2. 连接到MySQL
    console.log('🔌 连接MySQL...');
    mysqlConn = await mysql.createConnection(mysqlConfig);
    console.log('✅ MySQL连接成功');

    // 3. 清空现有数据
    await mysqlConn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await mysqlConn.execute('TRUNCATE TABLE dishes');
    await mysqlConn.execute('TRUNCATE TABLE ingredients');
    await mysqlConn.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🗑️ 已清空MySQL数据');

    // 4. 导入食材数据
    console.log('📥 导入食材数据...');
    for (const ing of ingredients) {
      await mysqlConn.execute(
        'INSERT INTO ingredients (id, name, category, unit, is_staple) VALUES (?, ?, ?, ?, ?)',
        [ing.id, ing.name, ing.category, ing.unit, ing.is_staple]
      );
    }
    console.log(`✅ 导入 ${ingredients.length} 种食材`);

    // 5. 导入菜品数据
    console.log('📥 导入菜品数据...');
    for (const dish of dishes) {
      await mysqlConn.execute(
        `INSERT INTO dishes (id, name, category, tags, difficulty, cooking_time, servings, description, ingredients, steps, tips, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dish.id,
          dish.name,
          dish.category,
          dish.tags,
          dish.difficulty,
          dish.cooking_time,
          dish.servings,
          dish.description,
          dish.ingredients,
          dish.steps,
          dish.tips,
          dish.image_url
        ]
      );
    }
    console.log(`✅ 导入 ${dishes.length} 道菜品`);

    // 6. 验证
    const [dishCount] = await mysqlConn.execute('SELECT COUNT(*) as count FROM dishes');
    const [ingCount] = await mysqlConn.execute('SELECT COUNT(*) as count FROM ingredients');

    console.log('');
    console.log('🎉 数据导入完成!');
    console.log(`📊 MySQL中共有 ${dishCount[0].count} 道菜品`);
    console.log(`📊 MySQL中共有 ${ingCount[0].count} 种食材`);

  } catch (error) {
    console.error('❌ 导入失败:', error.message);
  } finally {
    if (mysqlConn) await mysqlConn.end();
    if (sqliteDb) sqliteDb.close();
  }
}

importData();
