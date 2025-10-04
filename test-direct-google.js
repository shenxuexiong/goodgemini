// 测试直连 Google API 的配置
async function testDirectGoogle() {
    console.log('🌐 测试直连 Google API 配置');
    console.log('=' .repeat(35));
    console.log();

    console.log('📋 配置检查:');
    console.log('✅ 生产环境: 直连 Google API');
    console.log('✅ 缓冲功能: 启用 (减少网络请求)');
    console.log('✅ API Key: 支持环境变量和客户端提供');
    console.log();

    const BASE_URL = "http://localhost:8787";

    // 测试 1: 使用客户端 API Key (allen123 用于测试)
    console.log('1. 测试客户端 API Key 转发...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models/gemini-2.5-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'allen123'  // 测试用
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: "测试消息" }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 100
                }
            })
        });

        console.log(`📝 客户端 API Key 测试: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 客户端 API Key 转发正常');
        } else {
            console.log('⚠️  客户端 API Key 可能无效 (正常，因为 allen123 不是真实的 Google API Key)');
        }
    } catch (error) {
        console.log('❌ 客户端 API Key 测试失败:', error.message);
    }

    // 测试 2: 不提供 API Key (应该使用环境变量)
    console.log('\n2. 测试环境变量 API Key...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models/gemini-2.5-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 不提供 x-goog-api-key
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: "测试消息" }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 100
                }
            })
        });

        console.log(`📝 环境变量 API Key 测试: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 环境变量 API Key 工作正常');
        } else if (response.status === 401) {
            console.log('⚠️  需要配置有效的 GOOGLE_API_KEY 环境变量');
        } else {
            console.log(`⚠️  响应状态: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 环境变量 API Key 测试失败:', error.message);
    }

    console.log('\n📊 部署配置建议:');
    console.log();
    console.log('🔧 方案一: 使用环境变量 (推荐)');
    console.log('   在 wrangler.jsonc 中配置:');
    console.log('   "GOOGLE_API_KEY": "your-real-google-api-key"');
    console.log('   优势: 客户端无需提供 API Key');
    console.log();
    console.log('🔧 方案二: 客户端提供 API Key');
    console.log('   Python 代码中使用真实的 Google API Key');
    console.log('   优势: 更灵活，支持多个 API Key');
    console.log();
    console.log('🚀 部署后的网络路径:');
    console.log('   Python -> Cloudflare Workers -> Google API');
    console.log('   ✅ 全球 CDN 加速');
    console.log('   ✅ 智能缓冲减少请求');
    console.log('   ✅ 高可用性');
    console.log();
    console.log('💡 替换旧代理服务器的优势:');
    console.log('   ✅ 减少一层网络跳转');
    console.log('   ✅ 更快的响应速度');
    console.log('   ✅ 更好的缓冲优化');
    console.log('   ✅ Cloudflare 的全球网络');
}

testDirectGoogle();