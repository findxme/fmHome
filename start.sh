#!/bin/bash

echo "🍽️ 家庭点餐系统启动脚本"
echo "========================"

# 检查并安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd client && npm install && cd ..
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 安装后端依赖..."
    cd server && npm install && cd ..
fi

echo ""
echo "🚀 启动服务..."
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo ""

# 启动前后端
npm run dev
