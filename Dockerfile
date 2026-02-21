# 多阶段构建 Dockerfile

# 阶段 1: 构建前端
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client

# 复制前端 package 文件
COPY client/package*.json ./

# 安装前端依赖
RUN npm ci

# 复制前端源码
COPY client/ ./

# 构建前端生产版本
RUN npm run build

# 阶段 2: 构建后端
FROM node:18-alpine AS backend-builder
WORKDIR /app/server

# 复制后端 package 文件
COPY server/package*.json ./

# 安装后端依赖（仅生产依赖）
RUN npm ci --only=production

# 复制后端源码
COPY server/ ./

# 阶段 3: 最终运行镜像
FROM node:18-alpine
WORKDIR /app

# 安装 dumb-init 以正确处理信号
RUN apk add --no-cache dumb-init

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 从构建阶段复制文件
COPY --from=backend-builder --chown=nodejs:nodejs /app/server ./server
COPY --from=frontend-builder --chown=nodejs:nodejs /app/client/dist ./client/dist

# 切换到非 root 用户
USER nodejs

# 暴露端口
EXPOSE 3001

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 使用 dumb-init 启动应用
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
