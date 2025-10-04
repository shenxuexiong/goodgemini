@echo off
echo ========================================
echo Gemini Balance DO 项目初始化脚本
echo ========================================
echo.

echo 正在检查 Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 正在检查 pnpm...
pnpm --version >nul 2>&1
if errorlevel 1 (
    echo 正在安装 pnpm...
    npm install -g pnpm
)

echo 正在安装项目依赖...
pnpm install

echo.
echo ========================================
echo 安装完成！
echo ========================================
echo.
echo 接下来的步骤：
echo 1. 修改 wrangler.jsonc 中的 worker 名称
echo 2. 设置环境变量（在 Cloudflare Dashboard 中）
echo 3. 运行 'pnpm run deploy' 部署到 Cloudflare
echo.
echo 或者使用 Cloudflare Dashboard 连接 Git 自动部署
echo.
pause