@echo off
chcp 65001 >nul
echo 🔧 手动测试 Google Gemini API 代理
echo ===============================
echo.

echo 这个脚本将帮助你进行手动测试
echo.

:menu
echo 请选择测试类型:
echo.
echo   1. 测试基本连接
echo   2. 测试流式响应 (短文本)
echo   3. 测试流式响应 (长文本，触发缓冲)
echo   4. 测试管理界面
echo   5. 查看服务器状态
echo   0. 退出
echo.

set /p choice=请输入选择 (0-5): 

if "%choice%"=="1" goto test_connection
if "%choice%"=="2" goto test_short
if "%choice%"=="3" goto test_long
if "%choice%"=="4" goto test_admin
if "%choice%"=="5" goto test_status
if "%choice%"=="0" goto exit
goto invalid

:test_connection
echo.
echo 🔗 测试基本连接...
echo 发送 GET 请求到 http://localhost:8787
echo.
curl -X GET http://localhost:8787 -v
echo.
echo 💡 如果看到 HTML 响应，说明服务器正常运行
goto menu

:test_short
echo.
echo 📝 测试短文本流式响应...
echo 这个测试应该产生较少的数据包
echo.

echo 发送请求...
curl -X POST http://localhost:8787/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -H "x-goog-api-key: test-key" ^
  -d "{\"model\":\"gemini-2.5-flash\",\"messages\":[{\"role\":\"user\",\"content\":\"你好，请简单介绍一下自己。\"}],\"stream\":true}" ^
  -N
echo.
echo 💡 观察响应格式，正常模式应该是多个小的 chat.completion.chunk
goto menu

:test_long
echo.
echo 📚 测试长文本流式响应 (触发缓冲)...
echo 这个测试应该触发缓冲机制，产生 chat.completion.batch 响应
echo.

echo 发送请求...
curl -X POST http://localhost:8787/v1/chat/completions ^
  -H "Content-Type: application/json" ^
  -H "x-goog-api-key: test-key" ^
  -d "{\"model\":\"gemini-2.5-flash\",\"messages\":[{\"role\":\"user\",\"content\":\"请详细写一篇关于人工智能发展历史的文章，包括重要里程碑、关键技术突破、主要应用领域，要求内容详实，至少2000字。\"}],\"stream\":true,\"max_tokens\":4000}" ^
  -N
echo.
echo 💡 在调试模式下，应该看到 "object":"chat.completion.batch" 的响应
goto menu

:test_admin
echo.
echo 🛠️ 测试管理界面...
echo 打开浏览器访问管理界面
echo.
start http://localhost:8787
echo.
echo 💡 管理界面用于配置 API 密钥和查看状态
goto menu

:test_status
echo.
echo 📊 查看服务器状态...
echo.
echo 检查服务器是否响应...
curl -X GET http://localhost:8787/favicon.ico -I
echo.
echo 检查 API 端点...
curl -X OPTIONS http://localhost:8787/v1/chat/completions -I
echo.
goto menu

:invalid
echo ❌ 无效选择，请重新选择
goto menu

:exit
echo.
echo 👋 手动测试结束
echo.
echo 📋 测试总结:
echo   - 基本连接测试验证服务器是否正常运行
echo   - 短文本测试验证基本 API 功能
echo   - 长文本测试验证缓冲机制是否工作
echo   - 管理界面用于配置和监控
echo.
echo 📚 更多信息请查看 BUFFERING.md 文档
pause