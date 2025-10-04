@echo off
chcp 65001 >nul
echo 🧪 Google Gemini API 代理缓冲功能测试
echo ====================================
echo.

echo 请选择要运行的测试:
echo.
echo   1. 配置检查 (推荐先运行)
echo   2. 简单缓冲测试
echo   3. 完整缓冲功能测试
echo   4. 流式响应测试
echo   5. 运行所有测试
echo   0. 退出
echo.

set /p choice=请输入选择 (0-5): 

if "%choice%"=="1" goto config_check
if "%choice%"=="2" goto simple_test
if "%choice%"=="3" goto buffering_test
if "%choice%"=="4" goto streaming_test
if "%choice%"=="5" goto all_tests
if "%choice%"=="0" goto exit
goto invalid

:config_check
echo.
echo 🔍 运行配置检查...
call pnpm check:config
goto end

:simple_test
echo.
echo 🔬 运行简单缓冲测试...
echo 💡 确保开发服务器正在运行 (start-dev.bat)
echo.
call pnpm test:simple
goto end

:buffering_test
echo.
echo 📊 运行完整缓冲功能测试...
echo 💡 确保开发服务器正在运行 (start-dev.bat)
echo.
call pnpm test:buffering
goto end

:streaming_test
echo.
echo 🌊 运行流式响应测试...
echo 💡 确保开发服务器正在运行 (start-dev.bat)
echo.
call pnpm test:streaming
goto end

:all_tests
echo.
echo 🚀 运行所有测试...
echo 💡 确保开发服务器正在运行 (start-dev.bat)
echo.
echo 1/4 配置检查...
call pnpm check:config
echo.
echo 2/4 简单测试...
call pnpm test:simple
echo.
echo 3/4 缓冲测试...
call pnpm test:buffering
echo.
echo 4/4 流式测试...
call pnpm test:streaming
goto end

:invalid
echo ❌ 无效选择，请重新运行脚本
goto end

:end
echo.
echo 📋 测试完成！
echo.
echo 💡 如果测试失败，请检查:
echo   - 开发服务器是否正在运行
echo   - 网络连接是否正常
echo   - 配置是否正确 (运行配置检查)
echo.
pause
goto exit

:exit