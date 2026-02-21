#!/bin/bash

# fmHome 服务器环境初始化脚本
# 自动安装 Docker、Docker Compose 并配置部署环境

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}  fmHome 服务器环境初始化脚本${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""

# 检查是否为 root 用户
if [ "$EUID" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  建议使用普通用户执行此脚本（会在需要时使用 sudo）${NC}"
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 1. 更新系统包
echo -e "${YELLOW}📦 更新系统包...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. 安装必要工具
echo -e "${YELLOW}🔧 安装必要工具...${NC}"
sudo apt install -y curl git ca-certificates gnupg lsb-release

# 3. 检查并安装 Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker 已安装: $(docker --version)${NC}"
else
    echo -e "${YELLOW}🐋 安装 Docker...${NC}"

    # 添加 Docker 官方 GPG 密钥
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    # 设置 Docker 仓库
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    # 安装 Docker Engine
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # 将当前用户添加到 docker 组
    sudo usermod -aG docker $USER

    echo -e "${GREEN}✅ Docker 安装完成${NC}"
fi

# 4. 检查并安装 Docker Compose
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose (插件) 已安装: $(docker compose version)${NC}"
elif command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose (独立版) 已安装: $(docker-compose --version)${NC}"
else
    echo -e "${YELLOW}🔧 安装 Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose 安装完成${NC}"
fi

# 5. 启动 Docker 服务
echo -e "${YELLOW}🚀 启动 Docker 服务...${NC}"
sudo systemctl start docker
sudo systemctl enable docker

# 6. 创建部署目录
DEPLOY_PATH="${DEPLOY_PATH:-/opt/fmhome}"
echo -e "${YELLOW}📁 创建部署目录: $DEPLOY_PATH${NC}"
sudo mkdir -p $DEPLOY_PATH
sudo chown $USER:$USER $DEPLOY_PATH
cd $DEPLOY_PATH

# 创建子目录
mkdir -p data logs nginx/ssl

# 7. 配置防火墙（UFW）
if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}🔒 配置防火墙...${NC}"
    sudo ufw allow 22/tcp comment 'SSH'
    sudo ufw allow 3001/tcp comment 'fmHome App'
    sudo ufw allow 80/tcp comment 'HTTP'
    sudo ufw allow 443/tcp comment 'HTTPS'

    # 如果防火墙未启用，询问是否启用
    if ! sudo ufw status | grep -q "Status: active"; then
        read -p "是否启用防火墙？(y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo ufw --force enable
        fi
    fi
fi

# 8. 创建环境变量文件
if [ ! -f "$DEPLOY_PATH/.env" ]; then
    echo -e "${YELLOW}📝 创建环境变量文件...${NC}"
    cat > $DEPLOY_PATH/.env <<EOF
# 端口配置
PORT=3001

# Claude API Key (可选)
CLAUDE_API_KEY=

# Node 环境
NODE_ENV=production

# 部署路径
DEPLOY_PATH=$DEPLOY_PATH
EOF
    echo -e "${YELLOW}⚠️  请编辑 $DEPLOY_PATH/.env 文件，填入实际配置${NC}"
fi

# 9. 创建 docker-compose.yml（如果不存在）
if [ ! -f "$DEPLOY_PATH/docker-compose.yml" ]; then
    echo -e "${YELLOW}📝 创建 docker-compose.yml...${NC}"
    cat > $DEPLOY_PATH/docker-compose.yml <<EOF
version: '3.8'

services:
  app:
    image: ghcr.io/findxme/fmhome:latest
    container_name: fmhome-app
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
      - fmhome-network

networks:
  fmhome-network:
    driver: bridge
EOF
fi

# 10. 配置 SSH（提示）
echo ""
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}  ✅ 服务器环境初始化完成！${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo -e "${YELLOW}📋 接下来的步骤:${NC}"
echo ""
echo "1. 配置 SSH 密钥认证（如果还没有）:"
echo "   - 在本地生成密钥对: ssh-keygen -t ed25519 -C 'deploy'"
echo "   - 将公钥添加到服务器: cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys"
echo ""
echo "2. 编辑环境变量文件:"
echo "   nano $DEPLOY_PATH/.env"
echo ""
echo "3. 在 GitHub 仓库中配置 Secrets:"
echo "   - SERVER_HOST: $(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
echo "   - SERVER_USERNAME: $USER"
echo "   - SERVER_SSH_KEY: (私钥内容)"
echo "   - DEPLOY_PATH: $DEPLOY_PATH"
echo ""
echo "4. 推送代码到 GitHub main 分支，触发自动部署"
echo ""
echo -e "${GREEN}部署目录: $DEPLOY_PATH${NC}"
echo -e "${GREEN}服务端口: 3001${NC}"
echo ""
echo -e "${YELLOW}⚠️  重要提示:${NC}"
echo "   - 如果添加了用户到 docker 组，需要重新登录才能生效"
echo "   - 请确保编辑 .env 文件，填入必要的配置信息"
echo "   - 建议配置 SSL 证书以启用 HTTPS"
echo ""
echo "查看部署文档: cat DEPLOYMENT.md"
