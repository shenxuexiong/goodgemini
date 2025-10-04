// 测试 API Key 验证的脚本
async function testApiKeyAuth() {
    console.log('🔑 测试 API Key 验证');
    console.log('=' .repeat(30));
    console.log();

    const API_KEY = "sk-5vG01DxorRFnBXRvgpvhbaaaMTwe6RHAj5I8TE7XzPk36v9D";
    const BASE_URL = "http://localhost:8787";

    // 测试 1: 检查基本连接
    console.log('1. 测试基本连接...');
    try {
        const response = await fetch(BASE_URL);
        console.log(`✅ 基本连接: ${response.status}`);
    } catch (error) {
        console.log('❌ 基本连接失败:', error.message);
        return;
    }

    // 测试 2: 测试 API Key 验证
    console.log('\n2. 测试 API Key 验证...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models`, {
            headers: {
                'x-goog-api-key': API_KEY
            }
        });
        
        console.log(`📡 API Key 验证结果: ${response.status}`);
        
        if (response.status === 200) {
            console.log('✅ API Key 验证成功！');
        } else if (response.status === 401) {
            console.log('❌ API Key 验证失败 - 401 Unauthorized');
            console.log('💡 解决方案:');
            console.log('   1. 检查 wrangler.jsonc 中的 AUTH_KEY 配置');
            console.log('   2. 或启用 FORWARD_CLIENT_KEY_ENABLED');
        } else {
            console.log(`⚠️  意外的响应状态: ${response.status}`);
            const text = await response.text();
            console.log('响应内容:', text);
        }
    } catch (error) {
        console.log('❌ API Key 测试失败:', error.message);
    }

    // 测试 3: 测试 generateContent 端点
    console.log('\n3. 测试 generateContent 端点...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models/gemini-2.5-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
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

        console.log(`📝 generateContent 结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ generateContent 端点工作正常！');
            const result = await response.json();
            if (result.candidates && result.candidates[0]) {
                const text = result.candidates[0].content?.parts?.[0]?.text || '无内容';
                console.log('📄 响应内容:', text.substring(0, 100) + '...');
            }
        } else if (response.status === 401) {
            console.log('❌ generateContent 验证失败');
        } else {
            console.log(`⚠️  generateContent 响应异常: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ generateContent 测试失败:', error.message);
    }

    console.log('\n📊 测试总结:');
    console.log('如果看到 401 错误，说明 API Key 验证失败');
    console.log('请确保:');
    console.log('1. wrangler.jsonc 中的 AUTH_KEY 与你的 API Key 一致');
    console.log('2. 或者启用 FORWARD_CLIENT_KEY_ENABLED = true');
    console.log('3. 重启开发服务器使配置生效');
}

testApiKeyAuth();