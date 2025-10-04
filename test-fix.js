// 快速验证修复的测试脚本
console.log('🔧 验证项目修复状态...\n');

const fs = require('fs');
const path = require('path');

// 检查关键文件
const files = [
    'src/config.ts',
    'src/handler.ts', 
    'src/index.ts',
    'package.json',
    'tsconfig.json'
];

console.log('📁 检查关键文件:');
files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} 缺失`);
    }
});

// 检查配置文件语法
console.log('\n🔍 检查配置文件语法:');
try {
    const configContent = fs.readFileSync('src/config.ts', 'utf8');
    
    // 检查是否修复了 globalThis 类型问题
    if (configContent.includes('(globalThis as any).ENVIRONMENT')) {
        console.log('✅ TypeScript 类型问题已修复');
    } else if (configContent.includes('globalThis.ENVIRONMENT')) {
        console.log('❌ TypeScript 类型问题仍存在');
    }
    
    // 检查调试模式
    if (configContent.includes('isDebug: true')) {
        console.log('✅ 调试模式已启用');
    } else {
        console.log('⚠️  调试模式未启用');
    }
    
} catch (error) {
    console.log('❌ 配置文件读取失败:', error.message);
}

// 检查依赖
console.log('\n📦 检查依赖安装:');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules 存在');
    
    const criticalDeps = ['hono', 'wrangler', 'typescript'];
    criticalDeps.forEach(dep => {
        if (fs.existsSync(`node_modules/${dep}`)) {
            console.log(`✅ ${dep} 已安装`);
        } else {
            console.log(`❌ ${dep} 未安装`);
        }
    });
} else {
    console.log('❌ node_modules 不存在，需要运行 pnpm install');
}

console.log('\n🎯 修复验证完成！');
console.log('\n📋 下一步:');
console.log('1. 如果所有检查都通过，运行 init-project.bat');
console.log('2. 如果有问题，请先解决后再继续');
console.log('3. 成功后运行 start-dev.bat 启动服务器');