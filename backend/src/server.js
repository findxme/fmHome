import app from './app.js';
import { query } from './utils/db.js';
import { initDatabase } from './utils/init-db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await query('SELECT 1');
    console.log('数据库连接成功');
    
    await initDatabase();
    console.log('数据库初始化完成');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
}

startServer();
