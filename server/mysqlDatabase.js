import mysql from 'mysql2/promise';

// MySQL数据库配置
const dbConfig = {
  host: process.env.DB_HOST || '8.140.209.138',
  port: process.env.DB_PORT || 9000,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'fm123',
  database: process.env.DB_NAME || 'fm_home'
};

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// 模拟 better-sqlite3 的 API
export function getDatabase() {
  const pool = getPool();

  return {
    prepare: (sql) => ({
      run: async (...params) => {
        const [result] = await pool.execute(sql, params);
        return result;
      },
      get: async (...params) => {
        const [rows] = await pool.execute(sql, params);
        return rows[0] || null;
      },
      all: async (...params) => {
        // 对于 SELECT 查询，确保返回数组
        const [rows] = await pool.execute(sql, params);
        return rows || [];
      }
    }),
    exec: async (sql) => {
      await pool.execute(sql);
    },
    close: async () => {
      if (pool) {
        await pool.end();
        pool = null;
      }
    }
  };
}

export async function initDatabase() {
  const pool = getPool();

  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL数据库连接成功');
    connection.release();
    return pool;
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error.message);
    throw error;
  }
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
