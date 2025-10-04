@echo off
echo 🔧 修复 TypeScript 类型问题
echo ========================

echo 📦 安装缺失的类型定义...
pnpm add -D @cloudflare/workers-types

echo ✅ 修复完成！现在可以运行 init-project.bat