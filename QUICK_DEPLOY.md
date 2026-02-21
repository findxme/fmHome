# 快速部署参考

## 🎯 GitHub Secrets 配置清单

在 GitHub 仓库设置中添加以下 Secrets：

**Settings → Secrets and variables → Actions → New repository secret**

| Secret 名称 | 必填 | 说明 | 示例值 |
|------------|------|------|--------|
| `SERVER_HOST` | ✅ | 服务器 IP 或域名 | `192.168.1.100` |
| `SERVER_USERNAME` | ✅ | SSH 登录用户名 | `root` 或 `ubuntu` |
| `SERVER_SSH_KEY` | ✅ | SSH 私钥（完整内容） | `-----BEGIN...-----END` |
| `SERVER_PORT` | ❌ | SSH 端口 | `22`（默认） |
| `DEPLOY_PATH` | ❌ | 部署目录路径 | `/opt/fmhome`（默认） |

## 📝 服务器端必需文件

确保服务器部署目录（如 `/opt/fmhome`）中存在以下文件：

### 1. `.env` 文件

```env
PORT=3001
CLAUDE_API_KEY=your_api_key_here
NODE_ENV=production
```

### 2. `docker-compose.yml` 文件

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

## ⚡ 快速命令

### 生成 SSH 密钥对

```bash
# 本地执行
ssh-keygen -t ed25519 -C "github-deploy" -f ~/.ssh/fmhome_deploy

# 查看公钥（添加到服务器）
cat ~/.ssh/fmhome_deploy.pub

# 查看私钥（添加到 GitHub Secrets）
cat ~/.ssh/fmhome_deploy
```

### 服务器端配置

```bash
# 1. 添加 SSH 公钥到服务器
echo "your-public-key-here" >> ~/.ssh/authorized_keys

# 2. 创建部署目录
sudo mkdir -p /opt/fmhome
sudo chown $USER:$USER /opt/fmhome
cd /opt/fmhome

# 3. 创建必要的子目录
mkdir -p data logs

# 4. 创建 .env 文件
nano .env  # 填入配置

# 5. 创建 docker-compose.yml
nano docker-compose.yml  # 复制上面的内容
```

### 服务器一键初始化

```bash
# 下载并运行初始化脚本
curl -o server-setup.sh https://raw.githubusercontent.com/findxme/fmHome/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

## 🔄 部署流程

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **自动触发 GitHub Actions**
   - 构建 Docker 镜像
   - 推送到 GitHub Container Registry
   - SSH 连接到服务器
   - 拉取并运行最新镜像

3. **验证部署**
   ```bash
   # 在浏览器访问
   http://your-server-ip:3001

   # 或使用 curl 测试
   curl http://your-server-ip:3001/api/health
   ```

## 🛠️ 常用服务器命令

```bash
# 进入部署目录
cd /opt/fmhome

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f app

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 手动更新
docker-compose pull
docker-compose up -d

# 进入容器
docker-compose exec app sh

# 查看资源使用
docker stats
```

## ⚠️ 常见问题速查

### SSH 连接失败

```bash
# 检查 SSH 密钥格式是否正确（必须包含完整的头尾）
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# 测试 SSH 连接
ssh -i ~/.ssh/fmhome_deploy user@server-ip
```

### 容器无法启动

```bash
# 查看详细日志
docker-compose logs app

# 检查端口占用
sudo netstat -tlnp | grep 3001

# 检查防火墙
sudo ufw status
```

### 镜像拉取失败

```bash
# 登录 GitHub Container Registry
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 手动拉取镜像
docker pull ghcr.io/findxme/fmhome:latest
```

## 📊 部署检查清单

- [ ] GitHub Secrets 已配置（HOST, USERNAME, SSH_KEY）
- [ ] 服务器已安装 Docker 和 Docker Compose
- [ ] 服务器 SSH 公钥已添加
- [ ] 防火墙已开放 3001 端口
- [ ] 服务器上已创建 `.env` 文件
- [ ] 服务器上已创建 `docker-compose.yml` 文件
- [ ] 推送代码到 main 分支
- [ ] GitHub Actions workflow 成功运行
- [ ] 可以访问 `http://server-ip:3001`
- [ ] 健康检查通过 `/api/health`

## 🔗 相关文档

- [完整部署文档](./DEPLOYMENT.md)
- [项目 README](./README.md)
- [Docker 官方文档](https://docs.docker.com/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

---

**需要帮助？** 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取详细说明
