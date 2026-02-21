import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { seedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, 'fmhome.db');

let db;

export function getDatabase() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDatabase() {
  const database = getDatabase();

  // 菜品表
  database.exec(`
    CREATE TABLE IF NOT EXISTS dishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT,
      image_url TEXT,
      difficulty TEXT,
      cooking_time TEXT,
      servings TEXT,
      description TEXT,
      ingredients TEXT,
      steps TEXT,
      tips TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 食材表
  database.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      unit TEXT,
      is_staple INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 菜品-食材关联表
  database.exec(`
    CREATE TABLE IF NOT EXISTS dish_ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_id TEXT,
      ingredient_id TEXT,
      quantity TEXT,
      FOREIGN KEY (dish_id) REFERENCES dishes(id),
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    )
  `);

  // 购物清单表
  database.exec(`
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      items TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户偏好表
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      taste_preference TEXT DEFAULT '不限',
      difficulty_preference TEXT DEFAULT '不限',
      preferred_tags TEXT,
      allergies TEXT
    )
  `);

  // 食材库存表（冰箱管理）
  database.exec(`
    CREATE TABLE IF NOT EXISTS ingredient_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ingredient_name TEXT NOT NULL,
      quantity REAL DEFAULT 1,
      unit TEXT DEFAULT '个',
      category TEXT,
      expiry_date DATE,
      status TEXT DEFAULT 'in_stock',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 菜谱收藏表
  database.exec(`
    CREATE TABLE IF NOT EXISTS dish_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(dish_id)
    )
  `);

  // 菜单计划表
  database.exec(`
    CREATE TABLE IF NOT EXISTS menu_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      meal_type TEXT NOT NULL,
      dish_id TEXT,
      dish_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 烹饪记录表
  database.exec(`
    CREATE TABLE IF NOT EXISTS cooking_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dish_id TEXT,
      dish_name TEXT,
      rating INTEGER,
      notes TEXT,
      cooked_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户成就进度表
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      achievement_id TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      is_unlocked INTEGER DEFAULT 0,
      unlocked_at DATETIME,
      UNIQUE(achievement_id)
    )
  `);

  // 用户等级表
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_levels (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      level INTEGER DEFAULT 1,
      experience_points INTEGER DEFAULT 0,
      total_cooks INTEGER DEFAULT 0,
      consecutive_days INTEGER DEFAULT 0,
      last_cook_date DATE
    )
  `);

  // 家庭表
  database.exec(`
    CREATE TABLE IF NOT EXISTS families (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      invite_code TEXT UNIQUE,
      invite_expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 家庭成员关联表
  database.exec(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      family_id TEXT NOT NULL,
      member_name TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // AI对话历史表
  database.exec(`
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_type TEXT,
      user_input TEXT,
      ai_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 用户饮食档案表
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      taste_preferences TEXT,
      allergies TEXT,
      favorite_categories TEXT,
      disliked_ingredients TEXT,
      mood_preferences TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建索引优化查询性能
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
    CREATE INDEX IF NOT EXISTS idx_dishes_difficulty ON dishes(difficulty);
    CREATE INDEX IF NOT EXISTS idx_ingredients_category ON ingredients(category);
    CREATE INDEX IF NOT EXISTS idx_cooking_records_date ON cooking_records(cooked_at);
    CREATE INDEX IF NOT EXISTS idx_shopping_lists_date ON shopping_lists(date);
  `);

  // 检查是否需要种子数据
  const dishCount = database.prepare('SELECT COUNT(*) as count FROM dishes').get();
  if (dishCount.count === 0) {
    console.log('🌱 正在初始化种子数据...');
    seedData(database);
  }

  console.log('✅ 数据库初始化完成');
}

// 关闭数据库连接
export function closeDatabase() {
  if (db) {
    db.close();
  }
}
