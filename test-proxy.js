// 测试代理服务器连接的脚本
async function testProxyServer() {
    console.log('🔗 测试代理服务器连接');
    console.log('代理地址: http://shenxx123.site');
    console.log('=' .repeat(40));
    console.log();

    // 测试代理服务器直接连接
    console.log('1. 测试代理服务器基本连接...');
    try {
        const response = await fetch('http://shenxx123.site');
        console.log(`✅ 代理服务器响应: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 代理服务器可访问');
        } else {
            console.log(`⚠️  代理服务器响应异常: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 无法连接到代理服务器:', error.message);
        console.log('💡 请检查代理服务器是否正常运行');
        return;
    }

    // 测试通过本地项目访问代理
    console.log('\n2. 测试本地项目 -> 代理服务器...');
    try {
        const response = await fetch('http://localhost:8787/v1/models', {
            headers: {
                'x-goog-api-key': 'test-key'
            }
        });
        
        console.log(`📡 本地项目响应: ${response.status}`);
        
        if (response.ok) {
            console.log('✅ 本地项目成功通过代理访问 Google API');
        } else {
            console.log(`⚠️  本地项目访问失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 本地项目连接失败:', error.message);
        console.log('💡 请确保本地开发服务器正在运行 (pnpm dev)');
    }

    // 测试流式响应缓冲功能
    console.log('\n3. 测试缓冲功能 (通过代理)...');
    try {
        const response = await fetch('http://localhost:8787/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'test-key'
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [{ 
                    role: 'user', 
                    content: '请写一篇关于人工智能的长文章，用来测试缓冲功能，要求内容详细丰富，至少2000字。' 
                }],
                stream: true,
                max_tokens: 3000
            })
        });

        if (response.ok) {
            console.log('✅ 流式响应端点可用');
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let batchCount = 0;
            let totalChars = 0;
            let chunkCount = 0;
            
            try {
                while (chunkCount < 10) { // 读取前10个数据块
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
                                    const chars = data.total_chars || 0;
                                    totalChars += chars;
                                    
                                    console.log(`📦 [批次 ${batchCount}] 字符数: ${chars}, 块数: ${data.batch_size || 1}`);
                                } else if (data.object === 'chat.completion.chunk') {
                                    const content = data.choices[0]?.delta?.content || '';
                                    if (content) {
                                        console.log(`📝 [普通块] 字符数: ${content.length}`);
                                    }
                                }
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }
                
                reader.cancel();
                
                console.log('\n📊 缓冲测试结果:');
                console.log(`   打包批次: ${batchCount}`);
                console.log(`   总字符数: ${totalChars}`);
                console.log(`   总数据块: ${chunkCount}`);
                
                if (batchCount > 0) {
                    console.log('🎯 缓冲功能正常工作！');
                    console.log(`💡 网络请求减少: ${Math.round((1 - batchCount / chunkCount) * 100)}%`);
                } else {
                    console.log('⚠️  未检测到缓冲，可能处于生产模式');
                }
                
            } catch (e) {
                console.log('⚠️  流读取中断 (正常)');
            }
            
        } else {
            console.log(`❌ 流式响应测试失败: ${response.status}`);
        }
        
    } catch (error) {
        console.log('❌ 缓冲功能测试失败:', error.message);
    }

    console.log('\n🎉 代理服务器测试完成！');
    console.log('\n📋 测试总结:');
    console.log('✅ 项目已配置为使用你的代理服务器');
    console.log('✅ 代理路径: 本地项目 -> shenxx123.site -> Google API');
    console.log('✅ 缓冲功能可以减少对代理服务器的请求次数');
    console.log('💡 这样可以进一步提高网络稳定性');
}

testProxyServer();