@echo off
chcp 65001 >nul
echo 🌟 设置 Cloudflare Workers 本地开发环境
echo ========================================
echo.

echo 💡 This project needs Cloudflare Workers environment
echo    Using Wrangler to simulate local environment
echo.

echo 📦 步骤 1: 安装依赖...
pnpm install
echo.

echo 🔧 步骤 2: 创建 wrangler.toml 配置...
if not exist wrangler.toml (
    echo name = "gemini-api-proxy" > wrangler.toml
    echo main = "src/index.ts" >> wrangler.toml
    echo compatibility_date = "2024-01-01" >> wrangler.toml
    echo. >> wrangler.toml
    echo [vars] >> wrangler.toml
    echo AUTH_KEY = "test-auth-key" >> wrangler.toml
    echo HOME_ACCESS_KEY = "test-home-key" >> wrangler.toml
    echo FORWARD_CLIENT_KEY_ENABLED = "true" >> wrangler.toml
    echo. >> wrangler.toml
    echo [[durable_objects.bindings]] >> wrangler.toml
    echo name = "LOAD_BALANCER" >> wrangler.toml
    echo class_name = "LoadBalancer" >> wrangler.toml
    echo ✅ 配置文件已创建
) else (
    echo ✅ 配置文件已存在
)
echo.

echo 🚀 Step 3: Starting Wrangler dev server...
echo 💡 Running project in Cloudflare Workers simulation
echo 🔗 Server URL: http://localhost:8787
echo.
pnpm dev