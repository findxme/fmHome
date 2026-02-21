# 家庭智能点餐系统 (Family Meal Planner)

一个帮助年轻小家庭解决日常吃饭困扰的智能点餐系统。

## 功能特性

- **菜单商城** - 像逛商城一样浏览和选择菜品
- **智能推荐** - 根据口味偏好推荐菜品
- **菜单规划** - AI智能规划一周菜单
- **购物清单** - 自动汇总所需食材
- **食谱详情** - 详细的制作步骤和视频教程
- **烹饪问答** - AI解答烹饪疑问

## 技术栈

- **前端**: Vue 3 + Vite + TailwindCSS
- **后端**: Node.js + Express
- **数据库**: SQLite
- **AI**: Claude API (可选)

## 快速开始

### 1. 安装依赖

```bash
npm run install:all
```

或者分别安装：

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd client && npm install

# 安装后端依赖
cd ../server && npm install
```

### 2. 配置环境变量

编辑 `server/.env` 文件，配置API密钥：

```env
PORT=3001
# Claude API Key (可选，用于AI推荐功能)
CLAUDE_API_KEY=your_api_key_here
```

### 3. 启动开发服务器

```bash
# 启动前后端开发服务器
npm run dev
```

- 前端: http://localhost:3000
- 后端: http://localhost:3001

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
fmHome/
├── client/                 # 前端 (Vue 3)
│   ├── src/
│   │   ├── components/    # 可复用组件
│   │   ├── views/         # 页面组件
│   │   ├── stores/        # Pinia状态管理
│   │   ├── api/           # API封装
│   │   └── assets/        # 静态资源
│   ├── package.json
│   └── vite.config.js
├── server/                 # 后端 (Node.js)
│   ├── routes/            # API路由
│   ├── database.js        # 数据库配置
│   ├── seedData.js        # 种子数据
│   └── index.js           # 入口文件
└── package.json
```

## 包含菜品

系统预置了100道家常菜谱，包括：
- 肉类菜品 (红烧肉、糖醋排骨、宫保鸡丁等)
- 海鲜菜品 (清蒸鲈鱼、蒜蓉虾、白灼虾等)
- 素菜菜品 (番茄炒蛋、地三鲜、麻婆豆腐等)
- 汤类 (番茄蛋花汤、排骨玉米汤、鸡汤等)
- 早餐主食 (蛋炒饭、葱油拌面、三明治等)
- 甜品 (红枣银耳羹、芒果西米露等)

## API 接口

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/dishes` | GET | 获取菜品列表 |
| `/api/dishes/:id` | GET | 获取菜品详情 |
| `/api/dishes/recommend/daily` | GET | 获取每日推荐 |
| `/api/shopping-list` | GET/POST | 购物清单管理 |
| `/api/ai/recommend` | POST | AI智能推荐 |
| `/api/ai/plan` | POST | AI菜单规划 |
| `/api/videos/recipe/:dishName` | GET | 获取菜谱视频 |

## 扩展功能

### 配置Claude AI

1. 申请 Claude API Key: https://console.anthropic.com/
2. 在 `server/.env` 中配置 `CLAUDE_API_KEY`
3. 重启服务

### 添加菜品

编辑 `server/seedData.js` 文件，添加新的菜品数据。

## 浏览器支持

- Chrome (最新版本)
- Safari (最新版本)
- Firefox (最新版本)
- Edge (最新版本)

## License

MIT
