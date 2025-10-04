@echo off
chcp 65001 >nul
echo 🌟 启动 Google Gemini API 代理开发服务器
echo ==========================================
echo.

echo 📡 正在启动 Wrangler 开发服务器...
echo 🔗 服务器地址: http://localhost:8787
echo 🛑 按 Ctrl+C 停止服务器
echo.

echo 💡 提示:
echo   - 服务器启动后，在新的命令行窗口运行测试
echo   - 使用 run-tests.bat 进行功能测试
echo   - 管理界面: http://localhost:8787
echo.

call pnpm dev