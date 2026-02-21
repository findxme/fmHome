# 自动化部署指南

本文档详细说明如何设置从 GitHub 到服务器的自动化部署流程。

## 📋 目录

- [部署架构](#部署架构)
- [前置要求](#前置要求)
- [GitHub 配置](#github-配置)
- [服务器配置](#服务器配置)
- [首次部署](#首次部署)
- [验证部署](#验证部署)
- [常见问题](#常见问题)

## 🏗️ 部署架构

```
GitHub Repository (push to main)
    ↓
GitHub Actions (构建 Docker 镜像)
    ↓
GitHub Container Registry (存储镜像)
    ↓
SSH 连接到服务器
    ↓
服务器拉取镜像并重启容器
```

## ✅ 前置要求

### 本地环境
- Git 已安装
- 拥有仓库的推送权限

### 服务器环境
- 操作系统: Linux (推荐 Ubuntu 20.04+)
- Docker 已安装 (版本 20.10+)
- Docker Compose 已安装 (版本 2.0+)
- SSH 访问权限
- 开放端口: 3001 (或自定义端口)

## 🔧 GitHub 配置

### 1. 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret 名称 | 说明 | 示例 |
|------------|------|------|
| `SERVER_HOST` | 服务器 IP 地址或域名 | `192.168.1.100` 或 `example.com` |
| `SERVER_USERNAME` | SSH 登录用户名 | `root` 或 `ubuntu` |
| `SERVER_SSH_KEY` | SSH 私钥内容 | 完整的私钥文本 |
| `SERVER_PORT` | SSH 端口（可选） | `22`（默认） |
| `DEPLOY_PATH` | 服务器上的部署目录 | `/opt/fmhome` |
| `DOCKER_USERNAME` | Docker Hub 用户名（如使用 Docker Hub） | `yourusername` |
| `DOCKER_PASSWORD` | Docker Hub 密码（如使用 Docker Hub） | `yourpassword` |

### 2. 生成 SSH 密钥对（如果还没有）

在本地终端执行:

```bash
# 生成新的 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/fmhome_deploy

# 查看公钥（需要添加到服务器）
cat ~/.ssh/fmhome_deploy.pub

# 查看私钥（需要添加到 GitHub Secrets）
cat ~/.ssh/fmhome_deploy
```

### 3. 启用 GitHub Container Registry

GitHub Actions workflow 默认使用 GitHub Container Registry (ghcr.io)，它会自动启用。

如果需要公开访问镜像，需要在 GitHub 仓库设置中将 Package 设为 Public:
**Packages → 选择包 → Package settings → Change visibility → Public**

## 🖥️ 服务器配置

### 1. 安装 Docker 和 Docker Compose

```bash
# 更新软件包
sudo apt update

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2. 配置 SSH 访问

将之前生成的 SSH 公钥添加到服务器:

```bash
# 在服务器上执行
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将公钥内容追加到 authorized_keys
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 3. 创建部署目录

```bash
# 创建部署目录
sudo mkdir -p /opt/fmhome
sudo chown $USER:$USER /opt/fmhome
cd /opt/fmhome

# 创建数据和日志目录
mkdir -p data logs
```

### 4. 配置环境变量

```bash
# 创建 .env 文件
cd /opt/fmhome
nano .env
```

添加以下内容（根据实际情况修改）:

```env
PORT=3001
CLAUDE_API_KEY=your_claude_api_key_here
NODE_ENV=production
```

### 5. 创建 docker-compose.yml

```bash
cd /opt/fmhome
nano docker-compose.yml
```

添加以下内容:

```yaml
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
      - CLAUDE_API_KEY=${CLAUDE_API_KEY}
    volumes:
      - ./data:/app/server/data
      - ./logs:/app/server/logs
    networks:
      - fmhome-network

networks:
  fmhome-network:
    driver: bridge
```

### 6. 配置防火墙（如果需要）

```bash
# Ubuntu/Debian
sudo ufw allow 3001/tcp
sudo ufw allow 22/tcp  # SSH
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --reload
```

## 🚀 首次部署

### 方式一: 使用 GitHub Actions（推荐）

1. **提交代码到 main 分支**:
   ```bash
   git add .
   git commit -m "Setup CI/CD pipeline"
   git push origin main
   ```

2. **查看部署进度**:
   - 访问 GitHub 仓库
   - 点击 "Actions" 标签
   - 查看最新的 workflow 运行状态

3. **部署成功后，访问应用**:
   ```
   http://your-server-ip:3001
   ```

### 方式二: 手动部署

在服务器上执行:

```bash
cd /opt/fmhome

# 登录到 GitHub Container Registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 拉取镜像
docker pull ghcr.io/findxme/fmhome:latest

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f app
```

或使用提供的部署脚本:

```bash
# 从仓库复制 deploy.sh 到服务器
scp deploy.sh user@server:/opt/fmhome/

# 在服务器上执行
cd /opt/fmhome
chmod +x deploy.sh
./deploy.sh
```

## ✅ 验证部署

### 1. 检查容器状态

```bash
docker-compose ps
```

应该看到 `fmhome-app` 容器处于 `Up` 状态。

### 2. 检查应用健康状态

```bash
curl http://localhost:3001/api/health
```

应该返回:
```json
{"status":"ok","message":"家庭点餐系统服务运行中"}
```

### 3. 查看日志

```bash
# 查看实时日志
docker-compose logs -f app

# 查看最近 100 行日志
docker-compose logs --tail=100 app
```

### 4. 访问应用

在浏览器中访问:
```
http://your-server-ip:3001
```

## 🔄 日常使用

### 触发自动部署

每次推送代码到 `main` 分支时，都会自动触发部署:

```bash
git add .
git commit -m "Update features"
git push origin main
```

### 手动触发部署

在 GitHub Actions 页面，点击 "Run workflow" 按钮可以手动触发部署。

### 查看部署历史

在 GitHub 仓库的 "Actions" 标签中查看所有部署记录。

## 🛠️ 常用命令

### 服务器端

```bash
# 进入项目目录
cd /opt/fmhome

# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 更新到最新版本
docker-compose pull
docker-compose up -d

# 进入容器
docker-compose exec app sh

# 清理未使用的镜像
docker image prune -f
```

### 数据备份

```bash
# 备份数据库
cd /opt/fmhome
tar -czf backup-$(date +%Y%m%d).tar.gz data/

# 恢复数据库
tar -xzf backup-20240101.tar.gz
```

## ❓ 常见问题

### 1. 部署失败，提示 SSH 连接错误

**解决方案**:
- 检查 `SERVER_HOST` 是否正确
- 检查 `SERVER_SSH_KEY` 是否完整（包括 `-----BEGIN` 和 `-----END` 行）
- 确认服务器的 SSH 端口是否为 22（如果不是，需要设置 `SERVER_PORT`）
- 在服务器上检查 `~/.ssh/authorized_keys` 是否包含对应的公钥

### 2. 容器无法启动

**解决方案**:
```bash
# 查看详细日志
docker-compose logs app

# 检查配置文件
cat .env
cat docker-compose.yml

# 尝试手动运行容器
docker run --rm -it ghcr.io/findxme/fmhome:latest sh
```

### 3. 无法访问应用

**解决方案**:
- 检查防火墙是否开放了 3001 端口
- 检查容器是否正常运行: `docker-compose ps`
- 检查端口是否被占用: `netstat -tlnp | grep 3001`
- 查看应用日志: `docker-compose logs app`

### 4. 镜像拉取失败

**解决方案**:
```bash
# 确认已登录到 GitHub Container Registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 检查镜像是否存在
docker pull ghcr.io/findxme/fmhome:latest

# 如果镜像是私有的，确保服务器有访问权限
```

### 5. 数据库丢失

**解决方案**:
- 检查 volume 挂载是否正确: `docker-compose config`
- 确认数据目录存在: `ls -la /opt/fmhome/data`
- 从备份恢复数据

### 6. GitHub Actions 权限错误

**解决方案**:
- 确保仓库的 Actions 权限已启用
- 在仓库设置中: **Settings → Actions → General → Workflow permissions**
- 选择 "Read and write permissions"

## 🔒 安全建议

1. **使用 HTTPS**: 在生产环境中配置 SSL 证书（使用 Let's Encrypt 或其他 CA）
2. **定期更新**: 定期更新 Docker 镜像和系统包
3. **备份数据**: 设置自动备份任务
4. **限制访问**: 使用防火墙限制不必要的端口访问
5. **环境变量**: 不要将敏感信息（如 API Key）提交到 Git
6. **SSH 密钥**: 定期轮换 SSH 密钥
7. **监控日志**: 定期检查应用日志，发现异常及时处理

## 🔗 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [GitHub Container Registry 文档](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Let's Encrypt (免费 SSL 证书)](https://letsencrypt.org/)

## 📞 获取帮助

如果遇到问题，请:
1. 查看 GitHub Actions 日志
2. 查看服务器上的 Docker 日志
3. 在仓库中提交 Issue

---

**祝部署顺利！** 🎉
