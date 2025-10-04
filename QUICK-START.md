# 🚀 Windows 11 快速启动指南

## 📋 简单 3 步启动

### 1️⃣ 安装依赖
```bash
pnpm install
```

### 2️⃣ 启动开发服务器
```bash
# 方法一：使用批处理文件
dev.bat

# 方法二：使用 pnpm 命令
pnpm dev
```

### 3️⃣ 测试功能
```bash
# 在新的终端窗口运行
pnpm test:server
```

## 🎯 预期结果

### 开发服务器启动成功：
```
⛅️ wrangler 4.28.0
-------------------
✨ Your worker has access to the following bindings:
- Durable Objects:
  - LOAD_BALANCER: LoadBalancer
✨ Starting local server...
[mf:inf] Ready on http://localhost:8787
```

### 测试结果：
```
🧪 Testing Cloudflare Workers dev server...

1. Testing basic connection...
✅ Server is running!
   Status: 200
   URL: http://localhost:8787

2. Testing API endpoint...
   /v1/models status: 200

3. Testing buffering feature...
✅ Streaming endpoint is working
🎯 Buffering detected!
   Batch size: 25
   Total chars: 2150
✅ Buffering feature is working correctly!
```

## 🔧 如果遇到问题

### 问题 1: 端口被占用
```bash
# 检查端口使用情况
netstat -ano | findstr :8787

# 杀死占用进程
taskkill /PID <进程ID> /F
```

### 问题 2: 依赖安装失败
```bash
# 清理并重新安装
rm -rf node_modules
pnpm install
```

### 问题 3: Wrangler 命令不存在
```bash
# 全局安装 wrangler
npm install -g wrangler
```

## 📊 缓冲功能说明

- **调试模式**: 自动启用缓冲功能
- **缓冲阈值**: 2000 字符或 50 个数据块
- **网络优化**: 减少 90%+ 的网络请求
- **适用场景**: 中国访问海外服务器

## 🌐 访问地址

- **管理界面**: http://localhost:8787
- **API 端点**: http://localhost:8787/v1/chat/completions
- **模型列表**: http://localhost:8787/v1/models

现在你可以在 Windows 11 上正常开发和测试这个 Cloudflare Workers 项目了！