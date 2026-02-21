#!/bin/bash

# fmHome 部署配置助手
# 此脚本帮助你生成部署所需的 SSH 密钥和配置信息

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  fmHome 部署配置助手${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 1. 生成 SSH 密钥对
echo -e "${YELLOW}步骤 1/5: 生成 SSH 密钥对${NC}"
echo ""

SSH_KEY_PATH="$HOME/.ssh/fmhome_deploy"

if [ -f "$SSH_KEY_PATH" ]; then
    echo -e "${YELLOW}⚠️  检测到已存在的密钥: $SSH_KEY_PATH${NC}"
    read -p "是否使用现有密钥？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "正在生成新的 SSH 密钥对..."
        ssh-keygen -t ed25519 -C "fmhome-deploy-$(date +%Y%m%d)" -f "$SSH_KEY_PATH" -N ""
    fi
else
    echo "正在生成新的 SSH 密钥对..."
    ssh-keygen -t ed25519 -C "fmhome-deploy-$(date +%Y%m%d)" -f "$SSH_KEY_PATH" -N ""
fi

echo -e "${GREEN}✅ SSH 密钥对已生成${NC}"
echo ""

# 2. 收集服务器信息
echo -e "${YELLOW}步骤 2/5: 收集服务器信息${NC}"
echo ""

read -p "请输入服务器 IP 地址或域名: " SERVER_HOST
read -p "请输入 SSH 用户名 (默认: root): " SERVER_USERNAME
SERVER_USERNAME=${SERVER_USERNAME:-root}
read -p "请输入 SSH 端口 (默认: 22): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}
read -p "请输入部署路径 (默认: /opt/fmhome): " DEPLOY_PATH
DEPLOY_PATH=${DEPLOY_PATH:-/opt/fmhome}

echo ""
echo -e "${GREEN}收集到的信息：${NC}"
echo "服务器地址: $SERVER_HOST"
echo "SSH 用户名: $SERVER_USERNAME"
echo "SSH 端口: $SERVER_PORT"
echo "部署路径: $DEPLOY_PATH"
echo ""

# 3. 显示公钥（需要添加到服务器）
echo -e "${YELLOW}步骤 3/5: 配置服务器 SSH 访问${NC}"
echo ""
echo -e "${BLUE}请将以下公钥添加到服务器的 ~/.ssh/authorized_keys 文件中：${NC}"
echo ""
echo "----------------------------------------"
cat "${SSH_KEY_PATH}.pub"
echo "----------------------------------------"
echo ""
echo -e "${YELLOW}在服务器上执行以下命令：${NC}"
echo ""
cat << EOF
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "$(cat ${SSH_KEY_PATH}.pub)" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
EOF
echo ""
read -p "完成后按回车继续..."

# 4. 测试 SSH 连接
echo ""
echo -e "${YELLOW}步骤 4/5: 测试 SSH 连接${NC}"
echo ""
echo "正在测试 SSH 连接..."

if ssh -i "$SSH_KEY_PATH" -p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "${SERVER_USERNAME}@${SERVER_HOST}" "echo 'SSH 连接成功'" 2>/dev/null; then
    echo -e "${GREEN}✅ SSH 连接测试成功！${NC}"
else
    echo -e "${YELLOW}⚠️  SSH 连接测试失败，请检查：${NC}"
    echo "   1. 服务器地址和端口是否正确"
    echo "   2. 公钥是否已正确添加到服务器"
    echo "   3. 服务器防火墙是否开放 SSH 端口"
    echo ""
    echo "你可以手动测试连接："
    echo "ssh -i $SSH_KEY_PATH -p $SERVER_PORT ${SERVER_USERNAME}@${SERVER_HOST}"
    echo ""
fi

# 5. 生成 GitHub Secrets 配置指南
echo -e "${YELLOW}步骤 5/5: 生成 GitHub Secrets 配置${NC}"
echo ""

SECRETS_FILE="github-secrets-config.txt"

cat > "$SECRETS_FILE" << EOF
========================================
GitHub Secrets 配置信息
========================================

请访问以下网址配置 GitHub Secrets：
https://github.com/findxme/fmHome/settings/secrets/actions

点击 "New repository secret" 按钮，逐个添加以下配置：

----------------------------------------
Secret 1: SERVER_HOST
----------------------------------------
Name: SERVER_HOST
Value: $SERVER_HOST

----------------------------------------
Secret 2: SERVER_USERNAME
----------------------------------------
Name: SERVER_USERNAME
Value: $SERVER_USERNAME

----------------------------------------
Secret 3: SERVER_SSH_KEY
----------------------------------------
Name: SERVER_SSH_KEY
Value:
$(cat $SSH_KEY_PATH)

⚠️ 注意：复制时必须包含完整的内容，包括：
-----BEGIN OPENSSH PRIVATE KEY-----
和
-----END OPENSSH PRIVATE KEY-----

----------------------------------------
Secret 4: SERVER_PORT (可选)
----------------------------------------
Name: SERVER_PORT
Value: $SERVER_PORT

----------------------------------------
Secret 5: DEPLOY_PATH (可选)
----------------------------------------
Name: DEPLOY_PATH
Value: $DEPLOY_PATH

========================================
配置完成后的检查清单
========================================

GitHub 配置：
□ SERVER_HOST 已配置
□ SERVER_USERNAME 已配置
□ SERVER_SSH_KEY 已配置（完整的私钥）
□ SERVER_PORT 已配置（如果不是默认 22）
□ DEPLOY_PATH 已配置（如果不是默认路径）

服务器配置：
□ Docker 已安装
□ Docker Compose 已安装
□ SSH 公钥已添加
□ 防火墙已配置（开放 22 和 3001 端口）
□ 部署目录已创建 ($DEPLOY_PATH)
□ .env 文件已创建
□ docker-compose.yml 已创建

========================================
下一步操作
========================================

1. 初始化服务器环境（在服务器上执行）：
   curl -o server-setup.sh https://raw.githubusercontent.com/findxme/fmHome/main/server-setup.sh
   chmod +x server-setup.sh
   ./server-setup.sh

2. 配置 GitHub Secrets（参考上面的信息）

3. 触发部署：
   - 方式 1：推送代码到 main 分支
     git push origin main

   - 方式 2：手动触发
     访问: https://github.com/findxme/fmHome/actions
     点击 "Deploy to Server" -> "Run workflow"

4. 验证部署：
   访问: http://$SERVER_HOST:3001
   或执行: curl http://$SERVER_HOST:3001/api/health

========================================
EOF

echo -e "${GREEN}✅ 配置信息已保存到: $SECRETS_FILE${NC}"
echo ""
echo -e "${BLUE}重要提示：${NC}"
echo "1. 请妥善保管私钥文件: $SSH_KEY_PATH"
echo "2. 配置信息已保存到: $SECRETS_FILE"
echo "3. 配置完成后请删除该文件以确保安全"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  配置助手完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "接下来的步骤："
echo "1. 在服务器上运行初始化脚本（安装 Docker 等）"
echo "2. 在 GitHub 上配置 Secrets（参考 $SECRETS_FILE）"
echo "3. 触发部署测试"
echo ""
echo "详细文档："
echo "- 完整部署指南: DEPLOYMENT.md"
echo "- 快速参考: QUICK_DEPLOY.md"
echo "- 配置清单: SETUP_CHECKLIST.md"
echo ""
