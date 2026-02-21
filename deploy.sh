#!/bin/bash

# fmHome 自动化部署脚本
# 用于在服务器上部署应用

set -e  # 遇到错误立即退出

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="fmhome"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/fmhome}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-ghcr.io}"
GITHUB_OWNER="${GITHUB_OWNER:-findxme}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  fmHome 自动化部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker 未安装，请先安装 Docker${NC}"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose 未安装，请先安装 Docker Compose${NC}"
    exit 1
fi

# 创建部署目录
echo -e "${YELLOW}📁 创建部署目录: $DEPLOY_PATH${NC}"
mkdir -p "$DEPLOY_PATH"
cd "$DEPLOY_PATH"

# 如果不存在 docker-compose.yml，创建一个简化版本
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${YELLOW}📝 创建 docker-compose.yml${NC}"
    cat > docker-compose.yml <<EOF
version: '3.8'

services:
  app:
    image: ${DOCKER_REGISTRY}/${GITHUB_OWNER}/${PROJECT_NAME}:latest
    container_name: ${PROJECT_NAME}-app
    restart: unless-stopped
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - CLAUDE_API_KEY=\${CLAUDE_API_KEY}
    volumes:
      - ./data:/app/server/data
      - ./logs:/app/server/logs
    networks:
      - ${PROJECT_NAME}-network

networks:
  ${PROJECT_NAME}-network:
    driver: bridge
EOF
fi

# 如果不存在 .env 文件，创建模板
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 创建 .env 文件模板${NC}"
    cat > .env <<EOF
# 端口配置
PORT=3001

# Claude API Key (可选)
CLAUDE_API_KEY=

# 其他环境变量
NODE_ENV=production
EOF
    echo -e "${YELLOW}⚠️  请编辑 .env 文件，填入实际的配置信息${NC}"
fi

# 停止现有容器
echo -e "${YELLOW}🛑 停止现有容器...${NC}"
docker-compose down || true

# 拉取最新镜像
echo -e "${YELLOW}📥 拉取最新 Docker 镜像...${NC}"
docker pull ${DOCKER_REGISTRY}/${GITHUB_OWNER}/${PROJECT_NAME}:latest

# 启动容器
echo -e "${YELLOW}🚀 启动应用容器...${NC}"
docker-compose up -d

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# 检查容器状态
echo -e "${YELLOW}🔍 检查容器状态...${NC}"
docker-compose ps

# 检查健康状态
echo -e "${YELLOW}🏥 检查应用健康状态...${NC}"
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ 应用启动成功！${NC}"
        echo -e "${GREEN}🌐 访问地址: http://localhost:3001${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT+1))
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo -e "${RED}❌ 应用启动失败，请检查日志${NC}"
            docker-compose logs --tail=50 app
            exit 1
        fi
        echo -e "${YELLOW}⏳ 等待应用启动... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
        sleep 3
    fi
done

# 清理未使用的镜像
echo -e "${YELLOW}🧹 清理未使用的镜像...${NC}"
docker image prune -f

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "查看日志: docker-compose logs -f app"
echo "停止服务: docker-compose down"
echo "重启服务: docker-compose restart"
