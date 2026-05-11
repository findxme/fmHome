import mysql from 'mysql2/promise';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'fmhome'
});

async function createFavoritesTable() {
  const conn = await connection;
  
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id VARCHAR(36) PRIMARY KEY,
      familyId VARCHAR(36) DEFAULT 'default',
      recipeId VARCHAR(36) NOT NULL,
      recipeTitle VARCHAR(128),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uk_family_recipe (familyId, recipeId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  
  console.log('收藏表创建成功');
  await conn.end();
}

createFavoritesTable().catch(console.error);