# 🚀 部署配置清单

## 📋 第一步：收集服务器信息

请准备以下服务器信息（暂时不要填写，稍后会告诉你在哪里配置）：

### 必需信息

```
服务器 IP 地址: _____________________ (例如: 192.168.1.100 或 example.com)
SSH 用户名: _____________________ (例如: root 或 ubuntu)
SSH 端口: _____________________ (默认: 22)
部署路径: _____________________ (推荐: /opt/fmhome)
```

### SSH 密钥配置

**检查是否已有 SSH 密钥：**
```bash
ls ~/.ssh/id_*.pub
```

如果没有，需要生成新的密钥对：
```bash
# 在本地电脑上执行
ssh-keygen -t ed25519 -C "fmhome-deploy" -f ~/.ssh/fmhome_deploy

# 查看公钥（稍后需要添加到服务器）
cat ~/.ssh/fmhome_deploy.pub

# 查看私钥（稍后需要添加到 GitHub Secrets）
cat ~/.ssh/fmhome_deploy
```

## 📋 第二步：服务器环境检查

### 检查服务器系统信息

SSH 登录到服务器后执行：

```bash
# 查看操作系统
cat /etc/os-release

# 查看 Docker 是否已安装
docker --version

# 查看 Docker Compose 是否已安装
docker-compose --version
# 或
docker compose version

# 查看可用磁盘空间
df -h

# 查看防火墙状态（Ubuntu/Debian）
sudo ufw status
```

将检查结果记录如下：

```
操作系统: _____________________ (例如: Ubuntu 22.04)
Docker 版本: _____________________ (例如: 24.0.7 / 未安装)
Docker Compose 版本: _____________________ (例如: 2.21.0 / 未安装)
可用磁盘空间: _____________________ (例如: 50GB)
防火墙状态: _____________________ (例如: active / inactive)
```

## 📋 第三步：配置服务器

### 3.1 安装 Docker（如果未安装）

**方式 A：使用一键脚本（推荐）**
```bash
# 在服务器上执行
curl -o server-setup.sh https://raw.githubusercontent.com/findxme/fmHome/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

**方式 B：手动安装**

**Ubuntu/Debian:**
```bash
# 更新包管理器
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 将当前用户加入 docker 组
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker-compose --version
```

**CentOS/RHEL:**
```bash
# 更新系统
sudo yum update -y

# 安装 Docker
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3.2 配置 SSH 密钥认证

在服务器上执行：
```bash
# 创建 .ssh 目录（如果不存在）
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将你的公钥添加到 authorized_keys
# 方式 1：手动编辑
nano ~/.ssh/authorized_keys
# 粘贴之前生成的公钥内容（fmhome_deploy.pub）

# 方式 2：从本地复制
# 在本地电脑执行：
ssh-copy-id -i ~/.ssh/fmhome_deploy.pub 用户名@服务器IP

# 设置权限
chmod 600 ~/.ssh/authorized_keys

# 测试 SSH 连接（在本地执行）
ssh -i ~/.ssh/fmhome_deploy 用户名@服务器IP
```

### 3.3 创建部署目录

在服务器上执行：
```bash
# 创建部署目录
sudo mkdir -p /opt/fmhome
sudo chown $USER:$USER /opt/fmhome
cd /opt/fmhome

# 创建子目录
mkdir -p data logs

# 创建 .env 文件
cat > .env <<EOF
PORT=3001
CLAUDE_API_KEY=
NODE_ENV=production
EOF

# 创建 docker-compose.yml
cat > docker-compose.yml <<'EOF'
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
EOF

echo "✅ 部署目录创建完成！"
```

### 3.4 配置防火墙

**Ubuntu/Debian (UFW):**
```bash
# 安装 UFW（如果未安装）
sudo apt install -y ufw

# 允许必要的端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3001/tcp  # 应用端口

# 启用防火墙（首次启用时确保 SSH 端口已开放）
sudo ufw enable

# 查看状态
sudo ufw status
```

**CentOS/RHEL (firewalld):**
```bash
# 开放端口
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=3001/tcp

# 重载防火墙
sudo firewall-cmd --reload

# 查看状态
sudo firewall-cmd --list-all
```

## 📋 第四步：配置 GitHub Secrets

### 4.1 访问 GitHub Secrets 设置页面

打开浏览器，访问：
```
https://github.com/findxme/fmHome/settings/secrets/actions
```

### 4.2 添加 Secrets

点击 **"New repository secret"** 按钮，逐个添加以下配置：

#### Secret 1: SERVER_HOST
```
Name: SERVER_HOST
Value: 你的服务器IP或域名（例如: 192.168.1.100）
```

#### Secret 2: SERVER_USERNAME
```
Name: SERVER_USERNAME
Value: SSH登录用户名（例如: root）
```

#### Secret 3: SERVER_SSH_KEY
```
Name: SERVER_SSH_KEY
Value: 完整的私钥内容

在本地执行以下命令获取私钥：
cat ~/.ssh/fmhome_deploy

复制全部内容，包括：
-----BEGIN OPENSSH PRIVATE KEY-----
...（中间所有内容）...
-----END OPENSSH PRIVATE KEY-----
```

#### Secret 4: DEPLOY_PATH（可选）
```
Name: DEPLOY_PATH
Value: /opt/fmhome

（如果使用默认路径可以不配置）
```

#### Secret 5: SERVER_PORT（可选）
```
Name: SERVER_PORT
Value: 22

（如果使用默认 SSH 端口可以不配置）
```

### 4.3 验证 Secrets 配置

配置完成后，你应该在 Secrets 页面看到：
- ✅ SERVER_HOST
- ✅ SERVER_USERNAME
- ✅ SERVER_SSH_KEY
- （可选）DEPLOY_PATH
- （可选）SERVER_PORT

## 📋 第五步：测试部署

### 5.1 手动触发 GitHub Actions

1. 访问 Actions 页面：
   ```
   https://github.com/findxme/fmHome/actions
   ```

2. 点击左侧的 **"Deploy to Server"** workflow

3. 点击右上角的 **"Run workflow"** 按钮

4. 选择 **"main"** 分支

5. 点击 **"Run workflow"** 开始部署

### 5.2 查看部署日志

在 Actions 页面可以实时查看部署进度和日志。

### 5.3 验证部署结果

部署成功后，在浏览器访问：
```
http://你的服务器IP:3001
```

或使用 curl 测试：
```bash
curl http://你的服务器IP:3001/api/health
```

应该返回：
```json
{"status":"ok","message":"家庭点餐系统服务运行中"}
```

## 📋 第六步：日常使用

### 触发自动部署

每次推送代码到 main 分支时自动部署：
```bash
git add .
git commit -m "你的提交信息"
git push origin main
```

### 服务器管理命令

```bash
# SSH 登录服务器
ssh -i ~/.ssh/fmhome_deploy 用户名@服务器IP

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
```

## ❓ 常见问题

### 1. SSH 连接失败
- 检查服务器 IP 是否正确
- 检查 SSH 端口是否正确（默认 22）
- 检查防火墙是否开放 SSH 端口
- 确认公钥已正确添加到服务器

### 2. GitHub Actions 部署失败
- 检查所有 Secrets 是否配置正确
- 查看 Actions 日志了解具体错误
- 确认服务器 Docker 已正确安装

### 3. 无法访问应用
- 检查防火墙是否开放 3001 端口
- 检查容器是否正常运行：`docker-compose ps`
- 查看应用日志：`docker-compose logs app`

### 4. 端口被占用
```bash
# 查看端口占用
sudo netstat -tlnp | grep 3001

# 修改端口（在服务器的 .env 文件中）
PORT=3002  # 改成其他端口
```

## 📝 配置检查清单

完成以下所有项目后即可成功部署：

- [ ] 服务器已安装 Docker
- [ ] 服务器已安装 Docker Compose
- [ ] 已生成 SSH 密钥对
- [ ] 公钥已添加到服务器 authorized_keys
- [ ] 服务器防火墙已开放必要端口（22, 3001）
- [ ] 服务器上已创建部署目录（/opt/fmhome）
- [ ] 服务器上已创建 .env 文件
- [ ] 服务器上已创建 docker-compose.yml 文件
- [ ] GitHub Secrets 已配置 SERVER_HOST
- [ ] GitHub Secrets 已配置 SERVER_USERNAME
- [ ] GitHub Secrets 已配置 SERVER_SSH_KEY
- [ ] 已手动触发 GitHub Actions 测试部署
- [ ] 可以访问 http://服务器IP:3001
- [ ] 健康检查通过 /api/health

---

**准备好后按照这个清单逐步操作，有任何问题随时询问！** 🚀
