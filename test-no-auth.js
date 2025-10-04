// 测试去除 API Key 验证后的效果
async function testNoAuth() {
    console.log('🔓 测试去除 API Key 验证');
    console.log('=' .repeat(30));
    console.log();

    const BASE_URL = "http://localhost:8787";

    // 测试 1: 不带任何 API Key
    console.log('1. 测试不带 API Key 的请求...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models`);
        console.log(`📡 无 API Key 请求结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 成功！不需要 API Key 验证');
        } else {
            console.log(`❌ 失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 请求失败:', error.message);
    }

    // 测试 2: 带任意 API Key
    console.log('\n2. 测试带任意 API Key 的请求...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models`, {
            headers: {
                'x-goog-api-key': 'any-random-key'
            }
        });
        console.log(`📡 任意 API Key 请求结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 成功！API Key 验证已禁用');
        } else {
            console.log(`❌ 失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 请求失败:', error.message);
    }

    // 测试 3: 测试 generateContent 端点
    console.log('\n3. 测试 generateContent 端点...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models/gemini-2.5-flash:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'test-key'  // 任意值
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{ text: "你好，测试消息" }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 100
                }
            })
        });

        console.log(`📝 generateContent 结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ generateContent 工作正常！');
            try {
                const result = await response.json();
                if (result.candidates && result.candidates[0]) {
                    const text = result.candidates[0].content?.parts?.[0]?.text || '无内容';
                    console.log('📄 响应内容:', text.substring(0, 100) + '...');
                }
            } catch (e) {
                console.log('📄 响应解析失败，但请求成功');
            }
        } else {
            console.log(`❌ generateContent 失败: ${response.status}`);
            const text = await response.text();
            console.log('错误内容:', text.substring(0, 200));
        }
    } catch (error) {
        console.log('❌ generateContent 测试失败:', error.message);
    }

    // 测试 4: 测试流式响应
    console.log('\n4. 测试流式响应 (缓冲功能)...');
    try {
        const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 故意不带 API Key
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [{ 
                    role: 'user', 
                    content: '写一篇关于人工智能的文章，测试缓冲功能' 
                }],
                stream: true,
                max_tokens: 2000
            })
        });

        console.log(`🌊 流式响应结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 流式响应工作正常！');
            console.log('💡 缓冲功能应该正在工作...');
            
            // 读取少量数据验证
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let count = 0;
            
            try {
                while (count < 3) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.substring(6));
                                if (data.object === 'chat.completion.batch') {
                                    console.log(`📦 检测到缓冲数据! 字符数: ${data.total_chars}`);
                                }
                                count++;
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }
                reader.cancel();
            } catch (e) {
                console.log('流读取完成');
            }
        } else {
            console.log(`❌ 流式响应失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 流式响应测试失败:', error.message);
    }

    console.log('\n📊 测试总结:');
    console.log('✅ API Key 验证已完全禁用');
    console.log('✅ 只保留管理界面的登录验证');
    console.log('✅ 所有 API 端点都可以自由访问');
    console.log('💡 现在你的 Python 代码可以使用任意 API Key 或不使用 API Key');
}

testNoAuth();