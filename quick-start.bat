@echo off
chcp 65001 >nul
echo 🚀 Google Gemini API 代理 - 快速启动
echo ===================================
echo.

echo 欢迎使用 Google Gemini API 代理缓冲功能测试！
echo.
echo 这个项目实现了智能缓冲机制，解决中国用户访问海外服务器的网络丢包问题。
echo.

echo 📋 快速启动步骤:
echo.
echo   1️⃣  环境配置 (首次运行必需)
echo   2️⃣  项目初始化 (安装依赖、编译检查)
echo   3️⃣  启动开发服务器
echo   4️⃣  运行功能测试
echo   5️⃣  手动测试 (可选)
echo.

:menu
echo 请选择要执行的步骤:
echo.
echo   1. 环境配置 (setup-env.bat)
echo   2. 项目初始化 (init-project.bat)
echo   3. 启动开发服务器 (start-dev.bat)
echo   4. 运行功能测试 (run-tests.bat)
echo   5. 手动测试 (manual-test.bat)
echo   6. 一键完整流程 (1→2→3)
echo   0. 退出
echo.

set /p choice=请输入选择 (0-6): 

if "%choice%"=="1" goto setup_env
if "%choice%"=="2" goto init_project
if "%choice%"=="3" goto start_dev
if "%choice%"=="4" goto run_tests
if "%choice%"=="5" goto manual_test
if "%choice%"=="6" goto full_setup
if "%choice%"=="0" goto exit
goto invalid

:setup_env
echo.
echo 🔧 执行环境配置...
call setup-env.bat
goto menu

:init_project
echo.
echo 📦 执行项目初始化...
call init-project.bat
goto menu

:start_dev
echo.
echo 🌟 启动开发服务器...
echo 💡 服务器将在新窗口启动，请保持窗口开启
start "Gemini API Proxy Server" start-dev.bat
echo ✅ 开发服务器已在新窗口启动
echo 🔗 服务器地址: http://localhost:8787
goto menu

:run_tests
echo.
echo 🧪 运行功能测试...
call run-tests.bat
goto menu

:manual_test
echo.
echo 🔧 启动手动测试...
call manual-test.bat
goto menu

:full_setup
echo.
echo 🚀 执行一键完整流程...
echo.

echo 步骤 1/3: 环境配置
call setup-env.bat
if %errorlevel% neq 0 goto setup_error

echo.
echo 步骤 2/3: 项目初始化
call init-project.bat
if %errorlevel% neq 0 goto setup_error

echo.
echo 步骤 3/3: 启动开发服务器
echo 💡 服务器将在新窗口启动
start "Gemini API Proxy Server" start-dev.bat
echo ✅ 开发服务器已启动

echo.
echo 🎉 完整流程执行完成！
echo.
echo 📋 接下来你可以:
echo   - 运行功能测试验证缓冲机制
echo   - 进行手动测试体验 API 功能
echo   - 查看 BUFFERING.md 了解详细说明
echo.
goto menu

:setup_error
echo ❌ 设置过程中出现错误，请检查并重试
goto menu

:invalid
echo ❌ 无效选择，请重新选择
goto menu

:exit
echo.
echo 👋 感谢使用 Google Gemini API 代理！
echo.
echo 📚 相关文档:
echo   - BUFFERING.md: 缓冲功能详细说明
echo   - README.md: 项目基本信息
echo.
echo 🐛 如遇问题，请检查:
echo   - Node.js 和 pnpm 是否已安装
echo   - 网络连接是否正常
echo   - 配置文件是否正确
echo.
pause