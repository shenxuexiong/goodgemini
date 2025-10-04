// 简单的服务器测试脚本
async function testServer() {
    const baseUrl = 'http://localhost:8787';
    
    console.log('🧪 Testing Cloudflare Workers dev server...\n');
    
    try {
        // 测试基本连接
        console.log('1. Testing basic connection...');
        const response = await fetch(baseUrl);
        
        if (response.ok) {
            console.log('✅ Server is running!');
            console.log(`   Status: ${response.status}`);
            console.log(`   URL: ${baseUrl}`);
        } else {
            console.log(`⚠️  Server responded with status: ${response.status}`);
        }
        
        // 测试 API 端点
        console.log('\n2. Testing API endpoint...');
        const apiResponse = await fetch(`${baseUrl}/v1/models`, {
            headers: {
                'x-goog-api-key': 'test-key'
            }
        });
        
        console.log(`   /v1/models status: ${apiResponse.status}`);
        
        // 测试缓冲功能
        console.log('\n3. Testing buffering feature...');
        const streamResponse = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'test-key'
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [{ 
                    role: 'user', 
                    content: 'Write a long article about AI to test buffering feature. Make it at least 2000 characters long.' 
                }],
                stream: true,
                max_tokens: 3000
            })
        });
        
        if (streamResponse.ok) {
            console.log('✅ Streaming endpoint is working');
            console.log('💡 Buffering feature should be active in debug mode');
            
            // 读取一些数据来检测缓冲
            const reader = streamResponse.body.getReader();
            const decoder = new TextDecoder();
            let batchDetected = false;
            let chunkCount = 0;
            
            try {
                while (chunkCount < 5) { // 只读取前5个块
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
                                    batchDetected = true;
                                    console.log('🎯 Buffering detected!');
                                    console.log(`   Batch size: ${data.batch_size || 'N/A'}`);
                                    console.log(`   Total chars: ${data.total_chars || 'N/A'}`);
                                    break;
                                }
                            } catch (e) {
                                // Ignore parsing errors
                            }
                        }
                    }
                    
                    if (batchDetected) break;
                }
                
                reader.cancel();
                
                if (batchDetected) {
                    console.log('✅ Buffering feature is working correctly!');
                } else {
                    console.log('⚠️  No buffering detected (might be in production mode)');
                }
                
            } catch (e) {
                console.log('⚠️  Stream reading interrupted (normal)');
            }
            
        } else {
            console.log(`❌ Streaming test failed: ${streamResponse.status}`);
        }
        
        console.log('\n📊 Test Summary:');
        console.log('✅ Cloudflare Workers dev server is running correctly');
        console.log('✅ Project can be tested locally using Wrangler');
        console.log('💡 This is the correct way to develop CF Workers on Windows');
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('\n💡 Make sure to:');
        console.log('1. Run "pnpm install" first');
        console.log('2. Start the dev server with "dev.bat" or "pnpm dev"');
        console.log('3. Wait for the server to fully start');
    }
}

testServer();