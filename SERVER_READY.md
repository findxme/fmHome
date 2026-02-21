# 🎯 你的服务器已配置完成！

## ✅ 服务器端配置状态

**服务器信息：**
- 公网 IP: `111.231.51.104`
- 用户名: `root`
- 操作系统: OpenCloudOS 9.4
- Docker: ✅ 已安装（版本 28.4.0）
- Docker Compose: ✅ 已安装（版本 5.0.2）
- 部署目录: ✅ 已创建（/opt/fmhome）
- 配置文件: ✅ 已创建（.env, docker-compose.yml）

---

## 📋 接下来你需要完成的步骤

### 步骤 1：在你的本地电脑上生成 SSH 密钥

**在你的本地电脑（不是服务器）上执行：**

```bash
# 生成 SSH 密钥对
ssh-keygen -t ed25519 -C "fmhome-deploy" -f ~/.ssh/fmhome_deploy

# 当提示输入密码时，直接按回车（不设置密码）
```

**生成后会有两个文件：**
- `~/.ssh/fmhome_deploy` - 私钥（用于 GitHub Secrets）
- `~/.ssh/fmhome_deploy.pub` - 公钥（用于服务器）

### 步骤 2：将公钥添加到服务器

**在本地电脑上查看公钥：**
```bash
cat ~/.ssh/fmhome_deploy.pub
```

**复制输出的内容，然后在服务器上执行：**
```bash
# SSH 登录到服务器
ssh root@111.231.51.104

# 创建 .ssh 目录（如果不存在）
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 添加公钥（将下面的 YOUR_PUBLIC_KEY 替换为实际的公钥内容）
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys

# 设置权限
chmod 600 ~/.ssh/authorized_keys

# 退出
exit
```

**或者使用 ssh-copy-id 命令（更简单）：**
```bash
# 在本地电脑执行
ssh-copy-id -i ~/.ssh/fmhome_deploy.pub root@111.231.51.104
```

### 步骤 3：测试 SSH 密钥连接

**在本地电脑执行：**
```bash
ssh -i ~/.ssh/fmhome_deploy root@111.231.51.104
```

如果能成功登录，说明 SSH 密钥配置正确！

### 步骤 4：配置 GitHub Secrets

#### 4.1 访问 GitHub Secrets 设置页面

打开浏览器，访问：
```
https://github.com/findxme/fmHome/settings/secrets/actions
```

#### 4.2 添加以下 Secrets

点击 **"New repository secret"** 按钮，逐个添加：

---

**Secret 1: SERVER_HOST**
```
Name: SERVER_HOST
Value: 111.231.51.104
```

---

**Secret 2: SERVER_USERNAME**
```
Name: SERVER_USERNAME
Value: root
```

---

**Secret 3: SERVER_SSH_KEY**

在本地电脑执行以下命令获取私钥：
```bash
cat ~/.ssh/fmhome_deploy
```

复制**完整输出**（必须包括开头和结尾）：
```
Name: SERVER_SSH_KEY
Value:
-----BEGIN OPENSSH PRIVATE KEY-----
... 所有内容 ...
-----END OPENSSH PRIVATE KEY-----
```

⚠️ **重要**：必须包含完整的私钥，包括 `-----BEGIN` 和 `-----END` 行！

---

**Secret 4: DEPLOY_PATH（可选）**
```
Name: DEPLOY_PATH
Value: /opt/fmhome
```

---

**Secret 5: SERVER_PORT（可选）**
```
Name: SERVER_PORT
Value: 22
```

---

### 步骤 5：配置云平台安全组

⚠️ **重要**：由于这是云服务器，你需要在云平台的控制台配置安全组规则。

**需要开放的端口：**
- 22/TCP - SSH（通常已开放）
- 3001/TCP - 应用端口（需要添加）

**操作步骤（以腾讯云为例）：**
1. 登录云平台控制台
2. 找到你的服务器实例
3. 进入"安全组"设置
4. 添加入站规则：
   - 协议：TCP
   - 端口：3001
   - 来源：0.0.0.0/0（所有 IP）
   - 策略：允许

### 步骤 6：触发部署

#### 方式 A：手动触发（推荐首次部署使用）

1. 访问：https://github.com/findxme/fmHome/actions
2. 点击左侧 **"Deploy to Server"**
3. 点击右上角 **"Run workflow"** 按钮
4. 选择 **"main"** 分支
5. 点击绿色的 **"Run workflow"** 按钮

#### 方式 B：推送代码自动触发

```bash
# 在本地仓库执行
cd fmHome
git push origin main
```

### 步骤 7：验证部署

#### 7.1 查看部署日志

在 GitHub Actions 页面查看部署进度：
```
https://github.com/findxme/fmHome/actions
```

#### 7.2 测试应用访问

**在浏览器访问：**
```
http://111.231.51.104:3001
```

**或使用 curl 测试：**
```bash
curl http://111.231.51.104:3001/api/health
```

**预期返回：**
```json
{"status":"ok","message":"家庭点餐系统服务运行中"}
```

#### 7.3 查看服务器日志（如果需要）

```bash
# SSH 登录到服务器
ssh -i ~/.ssh/fmhome_deploy root@111.231.51.104

# 进入部署目录
cd /opt/fmhome

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f app

# 退出日志查看：Ctrl+C
```

---

## 📝 快速命令参考

### 本地操作

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "fmhome-deploy" -f ~/.ssh/fmhome_deploy

# 查看公钥
cat ~/.ssh/fmhome_deploy.pub

# 查看私钥（用于 GitHub Secrets）
cat ~/.ssh/fmhome_deploy

# 测试 SSH 连接
ssh -i ~/.ssh/fmhome_deploy root@111.231.51.104

# 推送代码触发部署
git push origin main
```

### 服务器操作

```bash
# 登录服务器
ssh -i ~/.ssh/fmhome_deploy root@111.231.51.104

# 进入部署目录
cd /opt/fmhome

# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f app

# 查看最近日志
docker-compose logs --tail=100 app

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 启动服务
docker-compose up -d

# 手动拉取最新镜像
docker-compose pull
docker-compose up -d

# 查看资源使用
docker stats fmhome-app
```

---

## ✅ 配置检查清单

完成以下所有项目即可成功部署：

### 本地配置
- [ ] 已生成 SSH 密钥对（~/.ssh/fmhome_deploy）
- [ ] 可以使用密钥 SSH 登录到服务器

### GitHub 配置
- [ ] SERVER_HOST = 111.231.51.104
- [ ] SERVER_USERNAME = root
- [ ] SERVER_SSH_KEY =（完整私钥）
- [ ] DEPLOY_PATH = /opt/fmhome
- [ ] SERVER_PORT = 22

### 云平台配置
- [ ] 安全组已开放 22 端口（SSH）
- [ ] 安全组已开放 3001 端口（应用）

### 部署验证
- [ ] GitHub Actions workflow 运行成功
- [ ] 可以访问 http://111.231.51.104:3001
- [ ] 健康检查通过 /api/health
- [ ] 容器状态正常

---

## 🆘 遇到问题？

### SSH 连接失败

```bash
# 详细测试连接
ssh -vvv -i ~/.ssh/fmhome_deploy root@111.231.51.104

# 检查私钥权限
chmod 600 ~/.ssh/fmhome_deploy
```

### GitHub Actions 部署失败

- 检查 Actions 日志了解具体错误
- 确认所有 Secrets 配置正确
- 确认私钥格式完整（包括 BEGIN 和 END 行）
- 确认可以用密钥 SSH 登录服务器

### 无法访问应用

1. 检查云平台安全组是否开放 3001 端口
2. 在服务器上检查容器状态：`docker-compose ps`
3. 查看应用日志：`docker-compose logs app`
4. 检查端口监听：`netstat -tlnp | grep 3001`

### 端口被占用

```bash
# 在服务器上查看端口占用
netstat -tlnp | grep 3001

# 如需更换端口，编辑 /opt/fmhome/.env
nano /opt/fmhome/.env
# 将 PORT=3001 改为其他端口，如 PORT=3002

# 同时修改 docker-compose.yml 中的端口映射
nano /opt/fmhome/docker-compose.yml
# 将 "3001:3001" 改为 "3002:3001"

# 重启服务
cd /opt/fmhome
docker-compose down
docker-compose up -d

# 记得在云平台安全组开放新端口
```

---

## 📞 需要帮助？

如果按照步骤操作后仍有问题，可以：
1. 查看 GitHub Actions 的详细日志
2. 检查服务器上的应用日志
3. 在仓库中提交 Issue

---

**祝部署顺利！** 🚀

下一步：
1. 在本地生成 SSH 密钥
2. 添加公钥到服务器
3. 配置 GitHub Secrets
4. 配置云平台安全组（开放 3001 端口）
5. 触发部署
