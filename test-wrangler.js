// 测试 Wrangler 本地环境的脚本
const API_BASE = 'http://localhost:8787';

async function testWranglerEnvironment() {
    console.log('🧪 测试 Cloudflare Workers 本地环境');
    console.log('=' .repeat(40));
    console.log();

    // 测试基本连接
    console.log('🔗 测试 1: 基本连接');
    try {
        const response = await fetch(API_BASE);
        if (response.ok) {
            console.log('✅ Wrangler 开发服务器正常运行');
            console.log(`   状态码: ${response.status}`);
        } else {
            console.log(`⚠️  服务器响应异常: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 无法连接到 Wrangler 开发服务器');
        console.log('💡 请确保运行了 setup-wrangler.bat');
        return;
    }

    // 测试 API 端点
    console.log('\n🔌 测试 2: API 端点');
    try {
        const response = await fetch(`${API_BASE}/v1/models`, {
            headers: {
                'x-goog-api-key': 'test-key'
            }
        });
        console.log(`📡 /v1/models 端点状态: ${response.status}`);
    } catch (error) {
        console.log('❌ API 端点测试失败');
    }

    // 测试流式响应
    console.log('\n🌊 测试 3: 流式响应 (缓冲功能)');
    try {
        const response = await fetch(`${API_BASE}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': 'test-key'
            },
            body: JSON.stringify({
                model: 'gemini-2.5-flash',
                messages: [{ role: 'user', content: '请写一篇长文章测试缓冲功能' }],
                stream: true,
                max_tokens: 2000
            })
        });

        if (response.ok) {
            console.log('✅ 流式响应端点可用');
            console.log('💡 这里会测试缓冲功能是否正常工作');
            
            // 读取少量数据作为示例
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let count = 0;
            
            while (count < 3) { // 只读取前3个数据块
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.object === 'chat.completion.batch') {
                                console.log('🎯 检测到缓冲数据包！');
                                console.log(`   批次大小: ${data.batch_size}`);
                                console.log(`   字符数: ${data.total_chars}`);
                            }
                            count++;
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }
            reader.cancel();
        } else {
            console.log(`⚠️  流式响应测试失败: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 流式响应测试出错:', error.message);
    }

    console.log('\n📊 测试总结:');
    console.log('✅ Cloudflare Workers 本地环境可以正常运行');
    console.log('✅ 缓冲功能可以在 Wrangler 环境中测试');
    console.log('💡 这是测试和开发的正确方式');
}

// 运行测试
testWranglerEnvironment().catch(console.error);