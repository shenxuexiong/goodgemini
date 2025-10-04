@echo off
chcp 65001 >nul
echo 🚀 初始化 Google Gemini API 代理项目
echo =====================================
echo.

echo 📦 步骤 1: 安装依赖包...
echo 💡 正在安装 Hono、Wrangler 和 TypeScript...
call pnpm install --silent
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败，请检查 pnpm 是否已安装
    echo.
    echo 🔧 可能的解决方案:
    echo   1. 安装 pnpm: npm install -g pnpm
    echo   2. 清理缓存: pnpm store prune
    echo   3. 删除 node_modules 重新安装
    echo.
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo 🔧 步骤 2: 检查 TypeScript 编译...
echo 💡 验证代码语法和类型...
call pnpm tsc --noEmit
if %errorlevel% neq 0 (
    echo ❌ TypeScript 编译检查失败
    echo.
    echo 🔧 请检查以下文件是否存在语法错误:
    echo   - src/config.ts
    echo   - src/handler.ts  
    echo   - src/index.ts
    echo.
    pause
    exit /b 1
)
echo ✅ TypeScript 编译检查通过
echo.

echo 📋 步骤 3: 检查项目配置...
echo 💡 验证缓冲功能配置...
call pnpm check:config
echo.

echo 🎯 初始化完成！
echo.
echo 📊 项目状态:
echo   ✅ 依赖包已安装
echo   ✅ TypeScript 编译通过
echo   ✅ 配置检查完成
echo   ✅ 缓冲功能已启用
echo.
echo 📚 接下来的步骤:
echo   1. 运行 start-dev.bat 启动开发服务器
echo   2. 运行 run-tests.bat 进行功能测试
echo   3. 查看 BUFFERING.md 了解详细说明
echo.
echo 💡 提示: 如果遇到问题，运行 check-status.js 进行诊断
echo.
pause