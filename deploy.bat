@echo off
echo 🚀 部署到 Cloudflare Workers
echo ========================
echo.

echo 📋 部署前检查...
pnpm deploy:check
echo.

set /p confirm=确认部署? (y/n): 
if /i "%confirm%" neq "y" (
    echo 部署已取消
    pause
    exit /b 0
)

echo.
echo 🌐 开始部署到 Cloudflare Workers...
pnpm deploy

echo.
echo 🎉 部署完成！
echo.
echo 📋 下一步:
echo 1. 复制 Cloudflare Workers 的 URL
echo 2. 更新 Python 代码中的 localhost:8787 为新的 URL
echo 3. 享受全球加速的 Google Gemini API 代理！
echo.
echo 💡 部署后的优势:
echo ✅ 全球 CDN 加速
echo ✅ 智能缓冲减少网络请求
echo ✅ 高可用性和稳定性
echo ✅ 解决跨洲际网络丢包问题
echo.
pause