@echo off
chcp 65001 >nul
echo 🔧 环境配置向导
echo ===============
echo.

echo 这个脚本将帮助你配置项目环境变量
echo.

echo 📋 需要配置的环境变量:
echo   - AUTH_KEY: API 认证密钥
echo   - HOME_ACCESS_KEY: 管理界面访问密钥
echo   - FORWARD_CLIENT_KEY_ENABLED: 是否转发客户端密钥
echo.

echo 💡 提示: 如果不确定，可以使用默认值进行测试
echo.

set /p setup_env=是否要配置环境变量? (y/n): 

if /i "%setup_env%"=="n" goto skip_env
if /i "%setup_env%"=="no" goto skip_env

echo.
echo 🔑 配置 AUTH_KEY (API 认证密钥):
set /p auth_key=请输入 AUTH_KEY (留空使用 'test-auth-key'): 
if "%auth_key%"=="" set auth_key=test-auth-key

echo.
echo 🏠 配置 HOME_ACCESS_KEY (管理界面密钥):
set /p home_key=请输入 HOME_ACCESS_KEY (留空使用 'test-home-key'): 
if "%home_key%"=="" set home_key=test-home-key

echo.
echo 🔄 配置 FORWARD_CLIENT_KEY_ENABLED:
set /p forward_enabled=是否启用客户端密钥转发? (y/n, 默认 y): 
if "%forward_enabled%"=="" set forward_enabled=y
if /i "%forward_enabled%"=="y" set forward_enabled=true
if /i "%forward_enabled%"=="yes" set forward_enabled=true
if /i "%forward_enabled%"=="n" set forward_enabled=false
if /i "%forward_enabled%"=="no" set forward_enabled=false

echo.
echo 📝 创建 wrangler.toml 配置文件...

(
echo name = "gemini-api-proxy"
echo main = "src/index.ts"
echo compatibility_date = "2024-01-01"
echo.
echo [vars]
echo AUTH_KEY = "%auth_key%"
echo HOME_ACCESS_KEY = "%home_key%"
echo FORWARD_CLIENT_KEY_ENABLED = "%forward_enabled%"
echo.
echo [[durable_objects.bindings]]
echo name = "LOAD_BALANCER"
echo class_name = "LoadBalancer"
) > wrangler.toml

echo ✅ 配置文件已创建: wrangler.toml
goto continue

:skip_env
echo ⏭️ 跳过环境变量配置
echo 💡 你可以稍后手动创建 wrangler.toml 文件

:continue
echo.
echo 🎯 环境配置完成！
echo.
echo 📋 下一步:
echo   1. 运行 init-project.bat 初始化项目
echo   2. 运行 start-dev.bat 启动开发服务器
echo   3. 运行 manual-test.bat 进行手动测试
echo.

if exist wrangler.toml (
    echo 📄 当前配置:
    type wrangler.toml
    echo.
)

echo 💡 如需修改配置，可以直接编辑 wrangler.toml 文件
echo.
pause