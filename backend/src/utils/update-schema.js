import { query } from './db.js';

async function updateSchema() {
  try {
    await query('SET FOREIGN_KEY_CHECKS = 0');
    
    await query('DROP TABLE IF EXISTS purchaseItems');
    await query('DROP TABLE IF EXISTS purchases');
    
    await query(`
      CREATE TABLE purchases (
        id VARCHAR(36) PRIMARY KEY,
        familyId VARCHAR(36) DEFAULT 'default',
        storeName VARCHAR(64),
        purchaseDate DATE NOT NULL,
        purchaseTime VARCHAR(8),
        totalAmount DECIMAL(10,2) DEFAULT 0,
        sourceType VARCHAR(16) DEFAULT 'manual',
        note VARCHAR(256),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('purchases 表已重建');
    
    await query(`
      CREATE TABLE purchaseItems (
        id VARCHAR(36) PRIMARY KEY,
        purchaseId VARCHAR(36) NOT NULL,
        name VARCHAR(64) NOT NULL,
        quantity DECIMAL(10,2) DEFAULT 1,
        price DECIMAL(10,2) DEFAULT 0,
        amountText VARCHAR(32),
        FOREIGN KEY (purchaseId) REFERENCES purchases(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('purchaseItems 表已重建');
    
    await query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('表结构更新完成');
    process.exit(0);
  } catch (error) {
    console.error('更新表结构失败:', error);
    process.exit(1);
  }
}

updateSchema();