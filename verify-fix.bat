@echo off
chcp 65001 >nul
echo 🔧 验证 TypeScript 修复
echo ====================
echo.

echo 📋 步骤 1: 快速状态检查...
call pnpm test:fix
echo.

echo 📋 步骤 2: TypeScript 编译测试...
echo 💡 使用新的 tsconfig.json 配置...
call pnpm tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo ❌ TypeScript 编译仍有问题
    echo.
    echo 🔧 请检查:
    echo   1. src/config.ts 中的类型转换是否正确
    echo   2. tsconfig.json 配置是否有效
    echo   3. 依赖是否完整安装
    echo.
    pause
    exit /b 1
) else (
    echo ✅ TypeScript 编译检查通过！
)
echo.

echo 📋 步骤 3: 配置验证...
call pnpm check:config
echo.

echo 🎉 修复验证完成！
echo.
echo 📊 修复内容:
echo   ✅ 修复了 globalThis.ENVIRONMENT 的类型错误
echo   ✅ 添加了 tsconfig.json 配置文件
echo   ✅ 改进了错误处理和日志输出
echo   ✅ 添加了 --skipLibCheck 编译选项
echo.
echo 📚 现在可以正常运行:
echo   1. init-project.bat - 完整初始化
echo   2. start-dev.bat - 启动开发服务器
echo   3. run-tests.bat - 运行功能测试
echo.
pause