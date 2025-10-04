# 部署前检查清单

在将项目上传到GitHub并部署到Cloudflare之前，请确保完成以下步骤：

## ✅ 准备工作

- [ ] 已经有GitHub账户
- [ ] 已经有Cloudflare账户  
- [ ] 已经有一个或多个Google Gemini API密钥

## ✅ 项目配置

- [ ] 已修改 `wrangler.jsonc` 中的 `name` 字段为你的worker名称
- [ ] 已确认 `wrangler.jsonc` 中没有硬编码的敏感信息
- [ ] 已准备好要设置的环境变量值：
  - [ ] `HOME_ACCESS_KEY` (管理面板密码)
  - [ ] `AUTH_KEY` (API调用密钥)
  - [ ] `FORWARD_CLIENT_KEY_ENABLED` (通常设为false)

## ✅ GitHub上传

- [ ] 已将项目上传到你的GitHub仓库
- [ ] 仓库设置为公开（Cloudflare免费版需要公开仓库）
- [ ] 已确认 `.gitignore` 正确配置，敏感文件不会被上传

## ✅ Cloudflare部署

- [ ] 已在Cloudflare Dashboard中连接GitHub仓库
- [ ] 已正确设置所有环境变量
- [ ] 已成功部署并获得Worker URL
- [ ] 已测试Worker URL可以正常访问

## ✅ 功能测试

- [ ] 可以使用 `HOME_ACCESS_KEY` 登录管理面板
- [ ] 可以在管理面板中添加Gemini API密钥
- [ ] 可以使用 `AUTH_KEY` 调用API接口
- [ ] API调用返回正确的响应

## ✅ 安全检查

- [ ] 已修改所有默认密码
- [ ] 环境变量中的密钥足够复杂
- [ ] 没有在代码中硬编码敏感信息
- [ ] 已定期备份重要配置

## 🚨 常见问题

**部署失败**
- 检查仓库是否为公开
- 确认环境变量名称拼写正确
- 查看Cloudflare部署日志

**无法访问管理面板**
- 确认 `HOME_ACCESS_KEY` 设置正确
- 检查Worker URL是否正确
- 清除浏览器缓存重试

**API调用失败**
- 确认 `AUTH_KEY` 设置正确
- 检查Gemini API密钥是否有效
- 查看Cloudflare Workers日志