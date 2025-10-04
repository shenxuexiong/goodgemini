# 部署指南

## 前置要求

1. GitHub 账户
2. Cloudflare 账户
3. 一个或多个 Google Gemini API 密钥

## 部署步骤

### 1. Fork 项目到你的 GitHub

1. 点击本仓库右上角的 "Fork" 按钮
2. 选择你的 GitHub 账户作为目标

### 2. 配置 Cloudflare Workers

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 `Workers & Pages`
3. 点击 `创建应用程序` -> `连接到 Git`
4. 选择你刚刚 Fork 的仓库
5. 配置项目设置：
   - **项目名称**: 自定义你的 Worker 名称
   - **生产分支**: `main` 或 `master`
   - **构建命令**: 留空（Cloudflare 会自动检测）
   - **构建输出目录**: 留空

### 3. 配置环境变量

在 Cloudflare Workers 设置中添加以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `HOME_ACCESS_KEY` | 网页管理面板密码 | `your-secure-password-123` |
| `AUTH_KEY` | API 请求认证密钥 | `your-api-auth-key` |
| `FORWARD_CLIENT_KEY_ENABLED` | 是否启用客户端密钥透传 | `false` |

### 4. 部署

1. 点击 `保存并部署`
2. 等待部署完成
3. 记录你的 Worker URL（格式：`https://your-worker-name.your-subdomain.workers.dev`）

### 5. 配置 API 密钥

1. 访问你的 Worker URL
2. 使用 `HOME_ACCESS_KEY` 登录管理面板
3. 批量添加你的 Gemini API 密钥

## 使用方法

### 在 AI 客户端中配置

- **Base URL**: `https://your-worker-name.your-subdomain.workers.dev`
- **API Key**: 你设置的 `AUTH_KEY`

### 支持的端点

- `/v1/chat/completions` - 聊天完成
- `/v1/embeddings` - 文本嵌入
- `/v1/models` - 模型列表

## 安全建议

1. 使用强密码作为 `HOME_ACCESS_KEY` 和 `AUTH_KEY`
2. 定期轮换 API 密钥
3. 监控 API 使用情况
4. 不要在代码中硬编码敏感信息

## 故障排除

如果遇到问题，请检查：

1. Cloudflare Workers 日志
2. 环境变量是否正确设置
3. API 密钥是否有效
4. 网络连接是否正常

## 更新项目

当原项目有更新时：

1. 在你的 Fork 仓库中点击 "Sync fork"
2. Cloudflare 会自动重新部署更新