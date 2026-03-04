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

## 🚀 生产部署

本项目支持基于 Docker 的自动化部署流程。

### 快速部署

#### 使用 Docker Compose（推荐）

```bash
# 1. 克隆仓库
git clone git@github.com:findxme/fmHome.git
cd fmHome

# 2. 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 3. 构建并启动
docker-compose up -d

# 4. 查看状态
docker-compose ps
docker-compose logs -f app
```

#### CI/CD 自动化部署

推送代码到 `main` 分支时，GitHub Actions 会自动：
1. 构建 Docker 镜像
2. 推送到 GitHub Container Registry
3. SSH 连接到服务器
4. 拉取最新镜像并重启服务

**详细配置步骤请参考：[DEPLOYMENT.md](./DEPLOYMENT.md)**

### 服务器快速设置

在服务器上运行以下命令快速安装环境：

```bash
# 下载并运行服务器初始化脚本
curl -o server-setup.sh https://raw.githubusercontent.com/findxme/fmHome/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

### 部署文件说明

| 文件 | 说明 |
|------|------|
| `Dockerfile` | Docker 镜像构建配置（多阶段构建） |
| `docker-compose.yml` | 生产环境容器编排配置 |
| `docker-compose.dev.yml` | 开发环境容器编排配置 |
| `.github/workflows/deploy.yml` | GitHub Actions 自动化部署流程 |
| `deploy.sh` | 服务器端部署脚本 |
| `server-setup.sh` | 服务器环境初始化脚本 |
| `DEPLOYMENT.md` | 详细的部署配置文档 |

## 备注

> 2026-03-04: 由 OpenClaw 助手添加测试备注 🎉

## License

MIT
