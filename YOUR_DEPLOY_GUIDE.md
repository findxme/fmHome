# 🎯 你的服务器部署步骤（Ubuntu/Debian 专用）

根据你的情况（Ubuntu/Debian 服务器，未安装 Docker，需要生成 SSH 密钥），按以下步骤操作：

---

## 📍 第一步：在本地生成配置（在你的电脑上执行）

### 选项 A：使用自动化配置助手（推荐）

```bash
cd fmHome
./setup-helper.sh
```

这个脚本会自动：
- ✅ 生成 SSH 密钥对
- ✅ 收集服务器信息
- ✅ 测试 SSH 连接
- ✅ 生成 GitHub Secrets 配置文件

**然后按照脚本输出的指示操作即可。**

---

### 选项 B：手动配置

#### 1. 生成 SSH 密钥对

```bash
# 生成密钥
ssh-keygen -t ed25519 -C "fmhome-deploy" -f ~/.ssh/fmhome_deploy

# 查看公钥（稍后需要添加到服务器）
cat ~/.ssh/fmhome_deploy.pub

# 查看私钥（稍后需要添加到 GitHub Secrets）
cat ~/.ssh/fmhome_deploy
```

**保存输出结果！**

---

## 📍 第二步：配置服务器（SSH 登录到服务器后执行）

### 1. 添加 SSH 公钥到服务器

```bash
# 创建 .ssh 目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 编辑 authorized_keys 文件
nano ~/.ssh/authorized_keys
```

**将刚才生成的公钥内容粘贴进去，保存并退出（Ctrl+X, Y, Enter）**

```bash
# 设置权限
chmod 600 ~/.ssh/authorized_keys
```

### 2. 测试 SSH 连接

**在本地电脑上测试：**
```bash
ssh -i ~/.ssh/fmhome_deploy 你的用户名@服务器IP
```

如果能成功登录，说明配置正确！

### 3. 在服务器上安装 Docker 环境

**方式 A：使用一键脚本（推荐）**

```bash
# 下载并运行服务器初始化脚本
curl -o server-setup.sh https://raw.githubusercontent.com/findxme/fmHome/main/server-setup.sh

# 添加执行权限
chmod +x server-setup.sh

# 运行脚本
./server-setup.sh
```

这个脚本会自动安装：
- ✅ Docker
- ✅ Docker Compose
- ✅ 创建部署目录
- ✅ 配置防火墙
- ✅ 创建必要的配置文件

**方式 B：手动安装**

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 将当前用户加入 docker 组
sudo usermod -aG docker $USER

# 4. 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 5. 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 6. 验证安装
docker --version
docker-compose --version

# 7. 创建部署目录
sudo mkdir -p /opt/fmhome
sudo chown $USER:$USER /opt/fmhome
cd /opt/fmhome

# 8. 创建子目录
mkdir -p data logs

# 9. 创建 .env 文件
cat > .env <<EOF
PORT=3001
CLAUDE_API_KEY=
NODE_ENV=production
EOF

# 10. 创建 docker-compose.yml
cat > docker-compose.yml <<'COMPOSE_EOF'
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
COMPOSE_EOF

# 11. 配置防火墙
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3001/tcp  # 应用端口
sudo ufw status

echo "✅ 服务器配置完成！"
```

---

## 📍 第三步：配置 GitHub Secrets

### 1. 访问 GitHub Secrets 设置页面

打开浏览器，访问：
```
https://github.com/findxme/fmHome/settings/secrets/actions
```

### 2. 添加以下 Secrets

点击 **"New repository secret"** 按钮，逐个添加：

#### ① SERVER_HOST
```
Name: SERVER_HOST
Value: 你的服务器IP地址（例如: 192.168.1.100）
```

#### ② SERVER_USERNAME
```
Name: SERVER_USERNAME
Value: 你的SSH用户名（例如: root 或 ubuntu）
```

#### ③ SERVER_SSH_KEY
```
Name: SERVER_SSH_KEY
Value: 完整的私钥内容

在本地执行：
cat ~/.ssh/fmhome_deploy

复制全部输出，包括：
-----BEGIN OPENSSH PRIVATE KEY-----
...所有内容...
-----END OPENSSH PRIVATE KEY-----
```

#### ④ SERVER_PORT（可选，如果使用默认端口 22 可以不配置）
```
Name: SERVER_PORT
Value: 22
```

#### ⑤ DEPLOY_PATH（可选，如果使用默认路径可以不配置）
```
Name: DEPLOY_PATH
Value: /opt/fmhome
```

---

## 📍 第四步：触发部署

### 方式 A：手动触发（推荐用于首次部署）

1. 访问：https://github.com/findxme/fmHome/actions
2. 点击左侧 **"Deploy to Server"**
3. 点击右上角 **"Run workflow"** 按钮
4. 选择 **"main"** 分支
5. 点击绿色的 **"Run workflow"** 按钮

### 方式 B：推送代码自动触发

```bash
# 在本地仓库执行
git push origin main
```

---

## 📍 第五步：验证部署

### 1. 查看部署日志

在 GitHub Actions 页面查看部署进度：
```
https://github.com/findxme/fmHome/actions
```

### 2. 测试应用访问

**在浏览器访问：**
```
http://你的服务器IP:3001
```

**或使用 curl 测试：**
```bash
curl http://你的服务器IP:3001/api/health
```

**预期返回：**
```json
{"status":"ok","message":"家庭点餐系统服务运行中"}
```

### 3. 查看服务器日志（如果需要）

SSH 登录到服务器：
```bash
ssh -i ~/.ssh/fmhome_deploy 你的用户名@服务器IP

# 进入部署目录
cd /opt/fmhome

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f app
```

---

## ✅ 配置检查清单

完成以下所有项目即可成功部署：

### 本地配置
- [ ] 已生成 SSH 密钥对（~/.ssh/fmhome_deploy）
- [ ] 已保存私钥内容（用于 GitHub Secrets）
- [ ] 已保存公钥内容（用于服务器）

### 服务器配置
- [ ] SSH 公钥已添加到服务器 ~/.ssh/authorized_keys
- [ ] 已测试 SSH 连接成功
- [ ] Docker 已安装并运行
- [ ] Docker Compose 已安装
- [ ] 防火墙已开放 22 和 3001 端口
- [ ] 部署目录已创建（/opt/fmhome）
- [ ] .env 文件已创建
- [ ] docker-compose.yml 文件已创建

### GitHub 配置
- [ ] SERVER_HOST 已配置
- [ ] SERVER_USERNAME 已配置
- [ ] SERVER_SSH_KEY 已配置（完整私钥）
- [ ] （可选）SERVER_PORT 已配置
- [ ] （可选）DEPLOY_PATH 已配置

### 部署验证
- [ ] GitHub Actions workflow 运行成功
- [ ] 可以访问 http://服务器IP:3001
- [ ] 健康检查通过 /api/health
- [ ] 容器状态正常（docker-compose ps 显示 Up）

---

## 🆘 遇到问题？

### SSH 连接失败
```bash
# 详细测试 SSH 连接
ssh -vvv -i ~/.ssh/fmhome_deploy 用户名@服务器IP

# 检查服务器上的公钥
cat ~/.ssh/authorized_keys
```

### Docker 安装失败
```bash
# 查看系统版本
cat /etc/os-release

# 手动安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### GitHub Actions 部署失败
- 查看 Actions 日志了解具体错误
- 确认所有 Secrets 配置正确
- 确认私钥格式完整（包括头尾）

### 应用无法访问
```bash
# 在服务器上检查
docker-compose ps              # 容器状态
docker-compose logs app        # 应用日志
sudo ufw status               # 防火墙状态
sudo netstat -tlnp | grep 3001  # 端口监听
```

---

## 📚 相关文档

- **完整部署文档**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **快速参考指南**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **详细检查清单**: [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

---

**准备好了吗？从第一步开始执行吧！** 🚀
