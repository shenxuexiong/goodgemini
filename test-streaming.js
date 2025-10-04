// 本地测试脚本 - 模拟调用 Cloudflare Workers 上的 Google Gemini API 代理
// 测试流式响应的打包功能

const API_BASE_URL = 'http://localhost:8787'; // Wrangler dev 服务器地址
const TEST_API_KEY = 'your-test-api-key'; // 替换为你的测试密钥

async function testStreamingWithBuffering() {
    console.log('🚀 开始测试流式响应打包功能...\n');

    const requestBody = {
        model: 'gemini-2.5-flash',
        messages: [
            {
                role: 'user',
                content: '请写一篇关于人工智能发展历史的长文章，包含详细的时间线和重要事件，至少2000字。'
            }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4000
    };

    try {
        const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TEST_API_KEY}`,
                'x-goog-api-key': TEST_API_KEY
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('✅ 连接成功，开始接收流式数据...\n');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let totalChunks = 0;
        let totalChars = 0;
        let batchCount = 0;
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('\n🏁 流式响应结束');
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // 处理完整的数据行
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 保留不完整的行

            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.substring(6));
                        totalChunks++;
                        
                        // 检测是否为打包数据
                        if (data.object === 'chat.completion.batch') {
                            batchCount++;
                            const batchChars = data.total_chars || 0;
                            const batchSize = data.batch_size || 0;
                            totalChars += batchChars;
                            
                            console.log(`📦 [批次 ${batchCount}] 接收到打包数据:`);
                            console.log(`   - 包含 ${batchSize} 个数据块`);
                            console.log(`   - 总字符数: ${batchChars}`);
                            console.log(`   - 内容预览: "${data.choices[0]?.delta?.content?.substring(0, 100)}..."`);
                            console.log('');
                        } else if (data.object === 'chat.completion.chunk') {
                            const content = data.choices[0]?.delta?.content || '';
                            totalChars += content.length;
                            
                            if (content) {
                                console.log(`📝 [普通块] 字符数: ${content.length}, 内容: "${content.substring(0, 50)}..."`);
                            }
                        }
                        
                    } catch (e) {
                        console.error('❌ 解析数据失败:', e.message);
                    }
                }
            }
        }

        console.log('\n📊 测试统计:');
        console.log(`   - 总数据块: ${totalChunks}`);
        console.log(`   - 打包批次: ${batchCount}`);
        console.log(`   - 总字符数: ${totalChars}`);
        console.log(`   - 平均每批次字符数: ${batchCount > 0 ? Math.round(totalChars / batchCount) : 0}`);

        if (batchCount > 0) {
            console.log('\n✅ 打包功能测试成功！');
            console.log(`🎯 成功将频繁的流式响应打包为 ${batchCount} 次传输`);
        } else {
            console.log('\n⚠️  未检测到打包数据，可能处于生产模式');
        }

    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.log('\n💡 请确保:');
        console.log('   1. Wrangler dev 服务器正在运行 (pnpm dev)');
        console.log('   2. API_KEY 配置正确');
        console.log('   3. 项目中 IsDebug 变量设置为 true');
    }
}

// 运行测试
testStreamingWithBuffering();