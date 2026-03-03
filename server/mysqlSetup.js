import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
  host: '8.140.209.138',
  port: 9000,
  user: 'root',
  password: 'fm123',
  database: 'fm_home'
};

async function createTables() {
  let connection;

  try {
    console.log('正在连接数据库...');
    // 先连接不带数据库，创建数据库
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      multipleStatements: true
    });

    console.log('✅ 连接成功');

    // 创建 dishes 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS dishes (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        tags TEXT,
        image_url TEXT,
        difficulty VARCHAR(20),
        cooking_time VARCHAR(50),
        servings VARCHAR(50),
        description TEXT,
        ingredients TEXT,
        steps TEXT,
        tips TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_difficulty (difficulty)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ dishes 表创建成功');

    // 创建 ingredients 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        unit VARCHAR(50),
        is_staple TINYINT(1) DEFAULT 0,
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ ingredients 表创建成功');

    // 创建 user_preferences 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT PRIMARY KEY,
        preferences JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ user_preferences 表创建成功');

    // 初始化用户偏好
    await connection.execute(`INSERT IGNORE INTO user_preferences (id) VALUES (1)`);

    // 创建 carts 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS carts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        dish_id VARCHAR(50) NOT NULL,
        dish_name TEXT,
        quantity INT DEFAULT 1,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_dish (dish_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ carts 表创建成功');

    // 创建 shopping_lists 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS shopping_lists (
        id VARCHAR(36) PRIMARY KEY,
        date DATE NOT NULL,
        items TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ shopping_lists 表创建成功');

    // 创建 checkins 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS checkins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        checkin_date DATE NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_checkin_date (checkin_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ checkins 表创建成功');

    // 创建 families 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS families (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        invite_code VARCHAR(10),
        invite_expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ families 表创建成功');

    // 创建 family_members 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS family_members (
        id INT PRIMARY KEY AUTO_INCREMENT,
        family_id VARCHAR(36) NOT NULL,
        member_name VARCHAR(100) NOT NULL,
        title VARCHAR(50) DEFAULT '家庭成员',
        avatar VARCHAR(10) DEFAULT '😎',
        color VARCHAR(20) DEFAULT '#a7f3d0',
        role VARCHAR(20) DEFAULT 'member',
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_family_id (family_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('✅ family_members 表创建成功');

    console.log('✅ 所有表创建完成');
    await connection.end();
    return true;

  } catch (error) {
    console.error('❌ 失败:', error.message);
    if (connection) await connection.end();
    throw error;
  }
}

createTables();
