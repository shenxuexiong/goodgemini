# 🚀 快速开始指南

欢迎使用 Google Gemini API 代理缓冲功能！这个项目专门为解决中国用户访问海外 Google Gemini API 时的网络丢包问题而设计。

## 📋 项目概述

- **目标**: 减少跨洲际网络请求次数，提高连接稳定性
- **方法**: 智能缓冲机制，将多个小数据包合并成大数据包
- **效果**: 网络请求减少 90% 以上，显著改善用户体验

## 🛠️ 快速启动

### 方法一：一键启动 (推荐)

```bash
# 双击运行
quick-start.bat
```

选择 "6. 一键完整流程" 即可自动完成所有设置。

### 方法二：分步执行

```bash
# 1. 检查项目状态
node check-status.js

# 2. 环境配置
setup-env.bat

# 3. 项目初始化  
init-project.bat

# 4. 启动开发服务器
start-dev.bat

# 5. 运行测试
run-tests.bat
```

## 📊 测试缓冲功能

### 自动化测试

```bash
# 运行所有测试
run-tests.bat

# 或者单独运行
pnpm test:buffering    # 完整缓冲测试
pnpm test:simple       # 简单功能测试
pnpm check:config      # 配置检查
```

### 手动测试

```bash
# 启动手动测试工具
manual-test.bat
```

选择不同的测试类型来验证功能：
- 基本连接测试
- 短文本流式响应
- 长文本流式响应 (触发缓冲)
- 管理界面测试

## 🔧 配置说明

### 环境变量 (wrangler.toml)

```toml
[vars]
AUTH_KEY = "your-auth-key"                    # API 认证密钥
HOME_ACCESS_KEY = "your-home-access-key"      # 管理界面密钥  
FORWARD_CLIENT_KEY_ENABLED = "true"           # 转发客户端密钥
```

### 缓冲参数 (src/config.ts)

```typescript
buffer: {
    enabled: true,
    maxChars: 2000,        // 2000字符触发打包
    maxChunks: 50,         // 最多50个块打包
    timeoutMs: 5000        // 5秒超时
}
```

## 📈 预期效果

### 网络优化对比

| 模式 | 数据包数量 | 网络请求 | 连接稳定性 |
|------|------------|----------|------------|
| 原始模式 | 100+ 小包 | 频繁 | 丢包严重 |
| 缓冲模式 | 3-5 大包 | 减少90%+ | 显著改善 |

### 测试结果示例

```
📊 缓冲功能测试结果:
   总数据包: 127
   打包批次: 4
   网络请求减少率: 96.9%
   平均每批次字符数: 2150
   ✅ 打包功能工作正常！
```

## 🌐 API 使用

### 标准 OpenAI 兼容接口

```javascript
// 流式请求
const response = await fetch('http://localhost:8787/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': 'your-api-key'
    },
    body: JSON.stringify({
        model: 'gemini-2.5-flash',
        messages: [{ role: 'user', content: '你好' }],
        stream: true
    })
});
```

### 缓冲响应格式

调试模式下，会收到打包的响应：

```json
{
  "object": "chat.completion.batch",
  "batch_size": 25,
  "total_chars": 2150,
  "buffer_time_ms": 1200,
  "choices": [{
    "delta": { "content": "完整的累积内容..." }
  }]
}
```

## 🐛 故障排除

### 常见问题

1. **服务器启动失败**
   ```bash
   # 检查 Node.js 和 pnpm 是否安装
   node --version
   pnpm --version
   
   # 重新安装依赖
   pnpm install
   ```

2. **测试连接失败**
   ```bash
   # 确保服务器正在运行
   curl http://localhost:8787
   
   # 检查端口是否被占用
   netstat -an | findstr 8787
   ```

3. **未检测到缓冲效果**
   ```bash
   # 检查调试模式是否启用
   pnpm check:config
   
   # 确认配置文件
   type src\config.ts | findstr isDebug
   ```

### 日志查看

开发服务器会输出详细日志：

```
[2024-01-01T12:00:00.000Z] [BASIC] 打包发送 25 个数据块，总字符数: 2150
[2024-01-01T12:00:01.200Z] [VERBOSE] 缓冲时间: 1200ms, 触发条件: 字符数阈值
```

## 📚 更多资源

- **详细文档**: [BUFFERING.md](BUFFERING.md)
- **项目说明**: [README.md](README.md)
- **配置参考**: `src/config.ts`
- **测试脚本**: `test-*.js`

## 🎯 下一步

1. **验证功能**: 运行完整测试确保缓冲机制正常工作
2. **性能调优**: 根据实际网络情况调整缓冲参数
3. **生产部署**: 配置生产环境并部署到 Cloudflare Workers
4. **监控优化**: 持续监控网络性能和用户体验

---

🎉 **恭喜！** 你现在已经拥有了一个强大的 Google Gemini API 代理，专门优化了跨洲际网络连接！