# 快速部署指南

## 🚀 5分钟部署到Cloudflare

### 步骤1: Fork项目
1. 点击GitHub页面右上角的 **Fork** 按钮
2. 选择你的GitHub账户

### 步骤2: 连接到Cloudflare
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **创建应用程序** → **连接到Git**
4. 选择你刚Fork的仓库
5. 项目名称改为你想要的名字（如：`my-gemini-proxy`）

### 步骤3: 配置环境变量
在部署设置中添加环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `HOME_ACCESS_KEY` | `your-secure-password-123` | 管理面板密码（请改为你的强密码） |
| `AUTH_KEY` | `your-api-key` | API调用密钥（请改为你的密钥） |
| `FORWARD_CLIENT_KEY_ENABLED` | `false` | 是否透传客户端密钥 |

### 步骤4: 部署
点击 **保存并部署**，等待部署完成。

### 步骤5: 添加Gemini API密钥
1. 访问你的Worker URL（如：`https://my-gemini-proxy.your-name.workers.dev`）
2. 使用 `HOME_ACCESS_KEY` 登录
3. 在管理面板中添加你的Gemini API密钥

## 🎯 使用方法

在任何支持OpenAI API的客户端中：
- **Base URL**: `https://your-worker-url.workers.dev`
- **API Key**: 你设置的 `AUTH_KEY`

支持的端点：
- `/v1/chat/completions`
- `/v1/embeddings` 
- `/v1/models`

## ⚠️ 重要提醒

1. **必须修改默认密码**：不要使用示例中的密码值
2. **保护你的密钥**：不要在公开场所分享你的API密钥
3. **定期检查**：使用管理面板的"一键检查"功能验证密钥有效性

## 🔧 故障排除

- **部署失败**：检查环境变量是否正确设置
- **无法访问**：确认Worker URL是否正确
- **API调用失败**：检查AUTH_KEY是否匹配
- **管理面板无法登录**：确认HOME_ACCESS_KEY是否正确