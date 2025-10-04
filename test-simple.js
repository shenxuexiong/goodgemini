// 简单的打包功能测试脚本
// 模拟 Google Gemini API 的流式响应打包

const API_BASE_URL = 'http://localhost:8787';

async function testBuffering() {
    console.log('🧪 测试流式响应打包功能\n');

    const testData = {
        model: 'gemini-2.5-flash',
        messages: [
            {
                role: 'user', 
                content: '请详细介绍一下机器学习的基本概念和应用领域，要求内容丰富详细。'
            }
        ],
        stream: true,
        max_tokens: 3000
    };

    try {
        console.log('📡 发送请求到本地代理服务器...');
        
        const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'test-key' // 测试用密钥
            },
            body: JSON.stringify(testData)
        });

        if (!response.ok) {
            console.error(`❌ 请求失败: ${response.status} ${response.statusText}`);
            return;
        }

        console.log('✅ 连接建立，开始接收数据...\n');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let packetCount = 0;
        let totalContent = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                    try {
                        const data = JSON.parse(line.substring(6));
                        packetCount++;
                        
                        if (data.object === 'chat.completion.batch') {
                            // 这是打包的数据
                            const content = data.choices[0]?.delta?.content || '';
                            const charCount = data.total_chars || content.length;
                            const batchSize = data.batch_size || 1;
                            
                            totalContent += content;
                            
                            console.log(`📦 [包 ${packetCount}] 打包数据:`);
                            console.log(`   字符数: ${charCount}`);
                            console.log(`   包含块数: ${batchSize}`);
                            console.log(`   内容: "${content.substring(0, 100)}..."`);
                            console.log('');
                            
                        } else if (data.object === 'chat.completion.chunk') {
                            // 普通流式数据
                            const content = data.choices[0]?.delta?.content || '';
                            totalContent += content;
                            
                            if (content) {
                                console.log(`📝 [块 ${packetCount}] 普通数据: "${content.substring(0, 50)}..."`);
                            }
                        }
                        
                    } catch (e) {
                        console.error('解析错误:', e.message);
                    }
                }
            }
        }

        console.log('\n📈 测试结果:');
        console.log(`总数据包: ${packetCount}`);
        console.log(`总内容长度: ${totalContent.length} 字符`);
        console.log(`平均每包字符数: ${Math.round(totalContent.length / packetCount)}`);
        
        if (packetCount < 10) {
            console.log('✅ 打包功能工作正常！成功减少了网络请求次数');
        } else {
            console.log('⚠️  数据包数量较多，检查打包逻辑是否正确');
        }

    } catch (error) {
        console.error('❌ 测试出错:', error.message);
        console.log('\n请检查:');
        console.log('- 运行 pnpm dev 启动本地服务器');
        console.log('- 确保 IsDebug = true');
        console.log('- 检查 API 密钥配置');
    }
}

// 执行测试
testBuffering();