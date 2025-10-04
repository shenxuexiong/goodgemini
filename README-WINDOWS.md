# 🪟 Windows 11 运行指南

## ❗ 重要说明

这个项目是 **Cloudflare Workers** 应用，不能直接在 Windows 11 的 Node.js 环境中运行。

### 为什么不能直接运行？

- 使用了 `cloudflare:workers` 模块
- 依赖 `DurableObject` 和 `DurableObjectState`
- 需要 Cloudflare Workers 运行时环境
- 使用了 Cloudflare 特有的 API

## 🛠️ 正确的运行方式

### 方法一：Wrangler 本地开发（推荐）

```bash
# 1. 设置 Wrangler 环境
setup-wrangler.bat

# 2. 测试环境
node test-wrangler.js
```

### 方法二：手动步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 创建配置文件 wrangler.toml
# (setup-wrangler.bat 会自动创建)

# 3. 启动 Wrangler 开发服务器
pnpm dev

# 4. 在新终端测试
curl http://localhost:8787
```

## 🎯 测试缓冲功能

一旦 Wrangler 服务器运行：

```bash
# 测试基本功能
curl http://localhost:8787

# 测试流式响应缓冲
node test-wrangler.js
```

## 📊 预期结果

### Wrangler 开发服务器启动成功：
```
⛅️ wrangler 4.28.0
-------------------
✨ Your worker has access to the following bindings:
- Durable Objects:
  - LOAD_BALANCER: LoadBalancer
✨ Starting local server...
[mf:inf] Ready on http://localhost:8787
```

### 缓冲功能测试成功：
```
🎯 检测到缓冲数据包！
   批次大小: 25
   字符数: 2150
```

## 🚀 部署到生产环境

```bash
# 部署到 Cloudflare Workers
pnpm deploy
```

## 💡 关键理解

1. **本地开发**: 使用 Wrangler 模拟 Cloudflare Workers 环境
2. **测试缓冲**: 在 Wrangler 环境中测试打包功能
3. **生产部署**: 部署到真实的 Cloudflare Workers

这样就能在 Windows 11 上正确开发和测试这个项目了！