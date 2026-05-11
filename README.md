# fmHome

一个家庭买菜 Web 应用，聚焦 4 个能力：

- 今天吃什么
- 菜谱做法
- 待买清单
- 买菜记账

## 技术栈

- **前端**: Vue 3 + Vite + Pinia + Vant
- **后端**: Express + MySQL + Prisma

## 目录

- `frontend/` 前端代码
- `backend/` 后端代码

## 快速开始

### 后端

```bash
cd backend
npm install
# 配置 DATABASE_URL 环境变量
npx prisma migrate dev
npm start
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端构建后会自动输出到 `backend/public/`，由 Express 静态托管：

```bash
cd frontend
npm run build
```
