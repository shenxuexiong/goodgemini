@echo off
echo 🔑 修复 API Key 验证问题
echo ========================
echo.

echo 📋 问题分析:
echo   - Python 代码使用: sk-5vG01DxorRFnBXRvgpvhbaaaMTwe6RHAj5I8TE7XzPk36v9D
echo   - 项目原配置: ajielu
echo   - 结果: 401 Unauthorized
echo.

echo ✅ 已修复配置:
echo   1. 更新 wrangler.jsonc 中的 AUTH_KEY
echo   2. 启用 FORWARD_CLIENT_KEY_ENABLED
echo.

echo 🚀 重启开发服务器以应用配置...
echo 💡 请在新终端运行: pnpm dev
echo.

echo 🧪 然后运行测试验证修复:
pnpm test:auth