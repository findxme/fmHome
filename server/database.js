import mysql from 'mysql2/promise';
import { seedData } from './seedData.js';

let pool;

// 创建类似 better-sqlite3 的 API 适配器
function createStatementAdapter(pool) {
  return function prepare(sql) {
    return {
      all: (...params) => pool.execute(sql, params).then(([rows]) => rows),
      get: (...params) => pool.execute(sql, params).then(([rows]) => rows[0]),
      run: (...params) => pool.execute(sql, params).then(([result]) => result)
    };
  };
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '8.140.209.138',
      port: process.env.DB_PORT || 9000,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'fm123',
      database: process.env.DB_NAME || 'fm_home',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

export function getDatabase() {
  // 返回类似 better-sqlite3 的 API
  return {
    prepare: createStatementAdapter(getPool())
  };
}

export async function initDatabase() {
  const pool = getPool();

  // 创建表结构
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS dishes (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      tags TEXT,
      image_url TEXT,
      difficulty VARCHAR(50),
      cooking_time VARCHAR(50),
      servings VARCHAR(50),
      description TEXT,
      ingredients TEXT,
      steps TEXT,
      tips TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255),
      unit VARCHAR(50),
      is_staple TINYINT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS dish_ingredients (
      id INT PRIMARY KEY AUTO_INCREMENT,
      dish_id VARCHAR(255),
      ingredient_id VARCHAR(255),
      quantity VARCHAR(100),
      FOREIGN KEY (dish_id) REFERENCES dishes(id),
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id VARCHAR(255) PRIMARY KEY,
      date DATE NOT NULL,
      items TEXT,
      status VARCHAR(50) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INT PRIMARY KEY CHECK (id = 1),
      taste_preference VARCHAR(50) DEFAULT '不限',
      difficulty_preference VARCHAR(50) DEFAULT '不限',
      preferred_tags TEXT,
      allergies TEXT
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS ingredient_stock (
      id INT PRIMARY KEY AUTO_INCREMENT,
      ingredient_name VARCHAR(255) NOT NULL,
      quantity DECIMAL(10,2) DEFAULT 1,
      unit VARCHAR(50) DEFAULT '个',
      category VARCHAR(100),
      expiry_date DATE,
      status VARCHAR(50) DEFAULT 'in_stock',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS dish_favorites (
      id INT PRIMARY KEY AUTO_INCREMENT,
      dish_id VARCHAR(255) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(dish_id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS menu_plans (
      id INT PRIMARY KEY AUTO_INCREMENT,
      date DATE NOT NULL,
      meal_type VARCHAR(50) NOT NULL,
      dish_id VARCHAR(255),
      dish_name VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT PRIMARY KEY AUTO_INCREMENT,
      dish_id VARCHAR(255) NOT NULL,
      dish_name VARCHAR(255),
      quantity INT DEFAULT 1,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(dish_id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cooking_records (
      id INT PRIMARY KEY AUTO_INCREMENT,
      dish_id VARCHAR(255),
      dish_name VARCHAR(255),
      rating INT,
      notes TEXT,
      cooked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      achievement_id VARCHAR(255) NOT NULL,
      progress INT DEFAULT 0,
      is_unlocked TINYINT DEFAULT 0,
      unlocked_at DATETIME,
      UNIQUE(achievement_id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_levels (
      id INT PRIMARY KEY CHECK (id = 1),
      level INT DEFAULT 1,
      experience_points INT DEFAULT 0,
      total_cooks INT DEFAULT 0,
      consecutive_days INT DEFAULT 0,
      last_cook_date DATE
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS families (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      invite_code VARCHAR(255) UNIQUE,
      invite_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INT PRIMARY KEY AUTO_INCREMENT,
      family_id VARCHAR(255) NOT NULL,
      member_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INT PRIMARY KEY AUTO_INCREMENT,
      conversation_type VARCHAR(100),
      user_input TEXT,
      ai_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INT PRIMARY KEY CHECK (id = 1),
      taste_preferences TEXT,
      allergies TEXT,
      favorite_categories TEXT,
      disliked_ingredients TEXT,
      mood_preferences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 创建索引 (MySQL 需要先检查是否存在)
  try {
    await pool.execute('CREATE INDEX idx_dishes_category ON dishes(category)');
  } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
  try {
    await pool.execute('CREATE INDEX idx_dishes_difficulty ON dishes(difficulty)');
  } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
  try {
    await pool.execute('CREATE INDEX idx_ingredients_category ON ingredients(category)');
  } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
  try {
    await pool.execute('CREATE INDEX idx_cooking_records_date ON cooking_records(cooked_at)');
  } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }
  try {
    await pool.execute('CREATE INDEX idx_shopping_lists_date ON shopping_lists(date)');
  } catch (e) { if (e.code !== 'ER_DUP_KEYNAME') throw e; }

  // 检查是否需要种子数据
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM dishes');
  if (rows[0].count === 0) {
    console.log('🌱 正在初始化种子数据...');
    // 传递一个适配器对象给 seedData
    const dbAdapter = {
      prepare: (sql) => ({
        run: (...params) => pool.execute(sql, params),
        get: (...params) => pool.execute(sql, params).then(([r]) => r[0]),
        all: (...params) => pool.execute(sql, params).then(([r]) => r)
      })
    };
    seedData(dbAdapter);
  }

  console.log('✅ 数据库初始化完成');
}

// 关闭数据库连接
export async function closeDatabase() {
  if (pool) {
    await pool.end();
  }
}
