@echo off
echo 🚀 启动 Google Gemini API 代理缓冲功能测试
echo.

echo 📋 可用的测试命令:
echo   1. pnpm dev          - 启动本地开发服务器
echo   2. pnpm test:simple  - 简单缓冲测试
echo   3. pnpm test:buffering - 完整缓冲功能测试
echo.

echo 💡 使用说明:
echo   - 首先运行 'pnpm dev' 启动服务器
echo   - 然后在新的命令行窗口运行测试脚本
echo   - 确保 src/config.ts 中 isDebug = true
echo.

echo 🔧 当前配置:
echo   - 调试模式: 启用
echo   - 缓冲阈值: 2000 字符
echo   - 超时时间: 5000 毫秒
echo.

pause