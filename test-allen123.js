// 测试 allen123 API Key 转发
async function testAllen123() {
    console.log('🔑 测试 allen123 API Key 转发');
    console.log('=' .repeat(35));
    console.log();

    const API_KEY = "allen123";
    const BASE_URL = "http://localhost:8787";

    // 测试 1: 测试 generateContent 端点
    console.log('1. 测试 generateContent 端点...');
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
                    parts: [{ text: "中国首都是哪个城市？你的模型名字是什么？简洁回答！" }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 1024
                }
            })
        });

        console.log(`📝 generateContent 结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 成功！allen123 API Key 工作正常');
            try {
                const result = await response.json();
                if (result.candidates && result.candidates[0]) {
                    const text = result.candidates[0].content?.parts?.[0]?.text || '无内容';
                    console.log('📄 响应内容:', text);
                    
                    // 显示使用统计
                    const usage = result.usageMetadata || {};
                    console.log(`🔢 Token使用: 输入=${usage.promptTokenCount || 'N/A'}, 输出=${usage.candidatesTokenCount || 'N/A'}, 总计=${usage.totalTokenCount || 'N/A'}`);
                }
            } catch (e) {
                console.log('📄 响应解析成功，但内容格式异常');
            }
        } else if (response.status === 401) {
            console.log('❌ 401 Unauthorized - allen123 可能不是正确的 API Key');
            console.log('💡 请检查你的代理服务器配置的 API Key');
        } else {
            console.log(`❌ 请求失败: ${response.status}`);
            const text = await response.text();
            console.log('错误内容:', text.substring(0, 200));
        }
    } catch (error) {
        console.log('❌ 请求异常:', error.message);
    }

    // 测试 2: 测试 models 端点
    console.log('\n2. 测试 models 端点...');
    try {
        const response = await fetch(`${BASE_URL}/v1/models`, {
            headers: {
                'x-goog-api-key': API_KEY
            }
        });
        
        console.log(`📡 models 端点结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ models 端点工作正常');
        } else {
            console.log(`❌ models 端点失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ models 端点异常:', error.message);
    }

    // 测试 3: 测试流式响应
    console.log('\n3. 测试流式响应 (缓冲功能)...');
    try {
        const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [{ 
                    role: 'user', 
                    content: '写一篇关于人工智能的短文，测试缓冲功能' 
                }],
                stream: true,
                max_tokens: 1000
            })
        });

        console.log(`🌊 流式响应结果: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 流式响应工作正常！');
            console.log('💡 缓冲功能应该正在工作...');
            
            // 读取少量数据验证缓冲
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let batchCount = 0;
            let chunkCount = 0;
            
            try {
                while (chunkCount < 5) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                            try {
                                const data = JSON.parse(line.substring(6));
                                chunkCount++;
                                
                                if (data.object === 'chat.completion.batch') {
                                    batchCount++;
                                    console.log(`📦 检测到缓冲数据! 批次: ${batchCount}, 字符数: ${data.total_chars || 'N/A'}`);
                                }
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }
                reader.cancel();
                
                if (batchCount > 0) {
                    console.log(`🎯 缓冲功能正常工作! 检测到 ${batchCount} 个批次`);
                } else {
                    console.log('⚠️  未检测到缓冲数据，可能处于生产模式');
                }
                
            } catch (e) {
                console.log('流读取完成');
            }
        } else {
            console.log(`❌ 流式响应失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 流式响应异常:', error.message);
    }

    console.log('\n📊 测试总结:');
    console.log('如果所有测试都成功，说明:');
    console.log('✅ allen123 API Key 正确转发到代理服务器');
    console.log('✅ 代理服务器接受 allen123 并转发到 Google API');
    console.log('✅ 缓冲功能正常工作');
    console.log('✅ 你的 Python 代码应该能正常工作');
}

testAllen123();