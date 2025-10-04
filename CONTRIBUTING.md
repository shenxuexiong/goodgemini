# 贡献指南

感谢你对本项目的关注！这个项目是基于开源项目 [gemini-balance-lite](https://github.com/tech-shrimp/gemini-balance-lite) 开发的。

## 如何贡献

### 报告问题
如果你发现了bug或有功能建议：
1. 检查是否已有相关的issue
2. 创建新的issue，详细描述问题或建议
3. 提供复现步骤（如果是bug）

### 提交代码
1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/your-feature-name`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature-name`
5. 创建Pull Request

### 开发环境设置
```bash
# 克隆仓库
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

# 安装依赖
pnpm install

# 本地开发
pnpm run dev

# 类型检查
pnpm run cf-typegen
```

### 代码规范
- 使用TypeScript
- 遵循现有的代码风格
- 添加适当的注释
- 确保类型安全

### 测试
在提交PR之前，请确保：
- 代码能够正常编译
- 功能测试通过
- 没有明显的性能问题

## 许可证
通过贡献代码，你同意你的贡献将在与本项目相同的许可证下发布。