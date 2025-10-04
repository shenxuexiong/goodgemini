@echo off
echo 🔓 API Key 验证已移除
echo ===================
echo.

echo ✅ 已完成的修改:
echo   1. 移除了 API 端点的 Key 验证逻辑
echo   2. 清理了 wrangler.jsonc 中的 AUTH_KEY
echo   3. 保留了管理界面的登录验证
echo.

echo 📋 现在的访问方式:
echo   - API 端点: 无需验证，自由访问
echo   - 管理界面: 需要 HOME_ACCESS_KEY 登录
echo.

echo 🧪 测试验证移除效果:
pnpm test:no-auth