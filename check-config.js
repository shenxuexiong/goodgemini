// 配置检查脚本 - 验证缓冲功能配置是否正确

const fs = require('fs');
const path = require('path');

function checkConfig() {
    console.log('🔍 检查 Google Gemini API 代理缓冲功能配置\n');

    let hasErrors = false;

    // 检查配置文件
    const configPath = path.join(__dirname, 'src', 'config.ts');
    if (!fs.existsSync(configPath)) {
        console.error('❌ 配置文件不存在: src/config.ts');
        return false;
    }

    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        // 检查调试模式
        const isDebugMatch = configContent.match(/isDebug:\s*(true|false)/);
        if (isDebugMatch) {
            const isDebug = isDebugMatch[1] === 'true';
            console.log(`🔧 调试模式: ${isDebug ? '✅ 启用' : '⚠️  禁用'}`);
            
            if (!isDebug) {
                console.log('💡 注意: 调试模式已禁用，缓冲功能不会工作');
                console.log('   要启用缓冲功能，请在 src/config.ts 中设置 isDebug: true');
                hasErrors = true;
            }
        } else {
            console.log('❌ 无法找到 isDebug 配置');
            hasErrors = true;
        }
    } catch (error) {
        console.error('❌ 读取配置文件失败:', error.message);
        return false;
    }

    // 检查缓冲配置
    const maxCharsMatch = configContent.match(/maxChars:\s*(\d+)/);
    const maxChunksMatch = configContent.match(/maxChunks:\s*(\d+)/);
    const timeoutMatch = configContent.match(/timeoutMs:\s*(\d+)/);

    if (maxCharsMatch) {
        console.log(`📊 字符阈值: ${maxCharsMatch[1]} 字符`);
    }
    if (maxChunksMatch) {
        console.log(`📦 块数阈值: ${maxChunksMatch[1]} 个块`);
    }
    if (timeoutMatch) {
        console.log(`⏱️  超时时间: ${timeoutMatch[1]} 毫秒`);
    }

    // 检查处理器文件
    const handlerPath = path.join(__dirname, 'src', 'handler.ts');
    if (!fs.existsSync(handlerPath)) {
        console.error('❌ 处理器文件不存在: src/handler.ts');
        return false;
    }

    const handlerContent = fs.readFileSync(handlerPath, 'utf8');
    
    // 检查是否导入了配置
    if (handlerContent.includes('import { getConfig, debugLog }')) {
        console.log('✅ 配置模块已正确导入');
    } else {
        console.log('❌ 配置模块导入有问题');
    }

    // 检查缓冲逻辑
    if (handlerContent.includes('chat.completion.batch')) {
        console.log('✅ 缓冲逻辑已实现');
    } else {
        console.log('❌ 缓冲逻辑未找到');
    }

    // 检查测试文件
    const testFiles = [
        'test-simple.js',
        'test-buffering.js',
        'test-streaming.js'
    ];

    console.log('\n📋 测试文件检查:');
    testFiles.forEach(file => {
        if (fs.existsSync(path.join(__dirname, file))) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} 缺失`);
        }
    });

    // 检查 package.json 脚本
    const packagePath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
        const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const scripts = packageContent.scripts || {};
        
        console.log('\n🛠️  可用脚本:');
        if (scripts['test:simple']) console.log('✅ pnpm test:simple');
        if (scripts['test:buffering']) console.log('✅ pnpm test:buffering');
        if (scripts['test:streaming']) console.log('✅ pnpm test:streaming');
        if (scripts['dev']) console.log('✅ pnpm dev');
    }

    console.log('\n🎯 使用步骤:');
    console.log('1. 运行 pnpm dev 启动本地服务器');
    console.log('2. 在新终端运行 pnpm test:buffering');
    console.log('3. 观察缓冲效果和网络请求减少情况');

    console.log('\n📚 更多信息请查看 BUFFERING.md 文档');

    return true;
}

// 运行检查
checkConfig();