// 项目状态检查脚本
const fs = require('fs');
const path = require('path');

function checkProjectStatus() {
    console.log('🔍 Google Gemini API 代理项目状态检查');
    console.log('=' .repeat(50));
    console.log();

    let allGood = true;

    // 检查必需文件
    const requiredFiles = [
        { path: 'package.json', desc: 'Package 配置文件' },
        { path: 'src/index.ts', desc: '主入口文件' },
        { path: 'src/handler.ts', desc: '请求处理器' },
        { path: 'src/config.ts', desc: '配置文件' },
        { path: 'src/auth.ts', desc: '认证模块' },
        { path: 'src/render.tsx', desc: '渲染模块' }
    ];

    console.log('📁 检查核心文件:');
    requiredFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
            console.log(`✅ ${file.desc}: ${file.path}`);
        } else {
            console.log(`❌ ${file.desc}: ${file.path} (缺失)`);
            allGood = false;
        }
    });

    // 检查测试文件
    console.log('\n🧪 检查测试文件:');
    const testFiles = [
        'test-simple.js',
        'test-buffering.js', 
        'test-streaming.js',
        'check-config.js'
    ];

    testFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} (缺失)`);
        }
    });

    // 检查脚本文件
    console.log('\n🛠️ 检查启动脚本:');
    const scriptFiles = [
        'quick-start.bat',
        'setup-env.bat',
        'init-project.bat',
        'start-dev.bat',
        'run-tests.bat',
        'manual-test.bat'
    ];

    scriptFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
        } else {
            console.log(`❌ ${file} (缺失)`);
        }
    });

    // 检查配置文件
    console.log('\n⚙️ 检查配置:');
    if (fs.existsSync('wrangler.toml')) {
        console.log('✅ wrangler.toml 配置文件存在');
        try {
            const config = fs.readFileSync('wrangler.toml', 'utf8');
            if (config.includes('AUTH_KEY')) {
                console.log('✅ AUTH_KEY 已配置');
            } else {
                console.log('⚠️ AUTH_KEY 未配置');
            }
            if (config.includes('HOME_ACCESS_KEY')) {
                console.log('✅ HOME_ACCESS_KEY 已配置');
            } else {
                console.log('⚠️ HOME_ACCESS_KEY 未配置');
            }
        } catch (e) {
            console.log('❌ 配置文件读取失败');
        }
    } else {
        console.log('⚠️ wrangler.toml 配置文件不存在 (运行 setup-env.bat 创建)');
    }

    // 检查 node_modules
    console.log('\n📦 检查依赖:');
    if (fs.existsSync('node_modules')) {
        console.log('✅ node_modules 存在');
        if (fs.existsSync('node_modules/hono')) {
            console.log('✅ Hono 框架已安装');
        }
        if (fs.existsSync('node_modules/wrangler')) {
            console.log('✅ Wrangler 已安装');
        }
    } else {
        console.log('❌ node_modules 不存在 (运行 pnpm install)');
        allGood = false;
    }

    // 检查缓冲功能配置
    console.log('\n🔧 检查缓冲功能:');
    if (fs.existsSync('src/config.ts')) {
        try {
            const configContent = fs.readFileSync('src/config.ts', 'utf8');
            if (configContent.includes('isDebug: true')) {
                console.log('✅ 调试模式已启用');
            } else if (configContent.includes('isDebug: false')) {
                console.log('⚠️ 调试模式已禁用 (缓冲功能不会工作)');
            }
            
            if (configContent.includes('maxChars: 2000')) {
                console.log('✅ 缓冲字符阈值: 2000');
            }
        } catch (e) {
            console.log('❌ 配置文件读取失败');
        }
    }

    // 总结
    console.log('\n📊 状态总结:');
    if (allGood) {
        console.log('🎉 项目状态良好，可以开始测试！');
        console.log('\n📋 建议的下一步:');
        console.log('1. 运行 quick-start.bat 开始快速设置');
        console.log('2. 或者按顺序运行:');
        console.log('   - setup-env.bat (配置环境)');
        console.log('   - init-project.bat (初始化项目)');
        console.log('   - start-dev.bat (启动服务器)');
        console.log('   - run-tests.bat (运行测试)');
    } else {
        console.log('⚠️ 项目存在一些问题，请先解决后再继续');
        console.log('\n🔧 建议的修复步骤:');
        console.log('1. 确保所有源文件都存在');
        console.log('2. 运行 pnpm install 安装依赖');
        console.log('3. 运行 setup-env.bat 配置环境');
    }

    console.log('\n💡 如需帮助，请查看 BUFFERING.md 文档');
}

// 运行检查
checkProjectStatus();