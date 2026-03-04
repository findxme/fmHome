import mysql from 'mysql2/promise';

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || '8.140.209.138',
  port: parseInt(process.env.DB_PORT) || 9000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'fm123',
  database: process.env.DB_NAME || 'fm_home'
};

async function migrate() {
  let connection;

  try {
    console.log('正在连接数据库...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ 连接成功');

    // 1. 创建 todos 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id VARCHAR(36) PRIMARY KEY,
        content TEXT NOT NULL,
        completed TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ todos 表创建成功');

    // 2. 创建 shopping_templates 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS shopping_templates (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        items TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ shopping_templates 表创建成功');

    // 3. 创建 purchase_history 表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS purchase_history (
        id VARCHAR(36) PRIMARY KEY,
        items TEXT,
        purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ purchase_history 表创建成功');

    // 4. 检查 family_members 表是否有 title, avatar, color 字段
    const [columns] = await connection.execute('DESCRIBE family_members');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('title')) {
      await connection.execute('ALTER TABLE family_members ADD COLUMN title VARCHAR(50) DEFAULT "家庭成员"');
      console.log('✅ family_members.title 字段添加成功');
    }
    if (!columnNames.includes('avatar')) {
      await connection.execute('ALTER TABLE family_members ADD COLUMN avatar VARCHAR(10) DEFAULT "😎"');
      console.log('✅ family_members.avatar 字段添加成功');
    }
    if (!columnNames.includes('color')) {
      await connection.execute('ALTER TABLE family_members ADD COLUMN color VARCHAR(20) DEFAULT "#a7f3d0"');
      console.log('✅ family_members.color 字段添加成功');
    }

    console.log('\n🎉 数据库迁移完成！');
    await connection.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ 迁移失败:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

migrate();
