// 完整的缓冲功能测试脚本
// 测试 Google Gemini API 代理的流式响应打包功能

const API_BASE_URL = 'http://localhost:8787';

class StreamingTest {
    constructor() {
        this.stats = {
            totalPackets: 0,
            batchPackets: 0,
            normalPackets: 0,
            totalChars: 0,
            totalBatchChars: 0,
            startTime: null,
            endTime: null,
            batches: []
        };
    }

    async runTest() {
        console.log('🧪 开始测试 Google Gemini API 流式响应缓冲功能');
        console.log('=' .repeat(60));
        
        this.stats.startTime = Date.now();

        const testCases = [
            {
                name: '短文本测试',
                prompt: '请简单介绍一下人工智能。',
                expectedBatches: 1
            },
            {
                name: '长文本测试',
                prompt: '请详细写一篇关于机器学习发展历史的文章，包括重要里程碑、关键技术突破、主要应用领域，以及未来发展趋势。要求内容详实，至少3000字。',
                expectedBatches: 2
            }
        ];

        for (const testCase of testCases) {
            console.log(`\n📋 执行测试: ${testCase.name}`);
            console.log('-'.repeat(40));
            
            await this.runSingleTest(testCase);
            
            console.log(`✅ ${testCase.name} 完成\n`);
        }

        this.printFinalStats();
    }

    async runSingleTest(testCase) {
        const requestBody = {
            model: 'gemini-2.5-flash',
            messages: [
                {
                    role: 'user',
                    content: testCase.prompt
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
                    'x-goog-api-key': 'test-key'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            await this.processStream(response, testCase);

        } catch (error) {
            console.error(`❌ 测试失败: ${error.message}`);
        }
    }

    async processStream(response, testCase) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let testStats = {
            packets: 0,
            batches: 0,
            chars: 0,
            startTime: Date.now()
        };

        console.log('📡 开始接收流式数据...');

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
                        testStats.packets++;
                        this.stats.totalPackets++;
                        
                        if (data.object === 'chat.completion.batch') {
                            // 打包数据
                            testStats.batches++;
                            this.stats.batchPackets++;
                            
                            const content = data.choices[0]?.delta?.content || '';
                            const charCount = data.total_chars || content.length;
                            const batchSize = data.batch_size || 1;
                            const bufferTime = data.buffer_time_ms || 0;
                            
                            testStats.chars += charCount;
                            this.stats.totalChars += charCount;
                            this.stats.totalBatchChars += charCount;
                            
                            this.stats.batches.push({
                                size: batchSize,
                                chars: charCount,
                                time: bufferTime,
                                isFinal: data.is_final || false
                            });
                            
                            console.log(`📦 [批次 ${testStats.batches}] 字符: ${charCount}, 块数: ${batchSize}, 缓冲时间: ${bufferTime}ms`);
                            
                        } else if (data.object === 'chat.completion.chunk') {
                            // 普通流式数据
                            this.stats.normalPackets++;
                            const content = data.choices[0]?.delta?.content || '';
                            testStats.chars += content.length;
                            this.stats.totalChars += content.length;
                            
                            if (content) {
                                console.log(`📝 [普通块] 字符: ${content.length}`);
                            }
                        }
                        
                    } catch (e) {
                        console.error('解析数据失败:', e.message);
                    }
                }
            }
        }

        const duration = Date.now() - testStats.startTime;
        console.log(`\n📊 ${testCase.name} 统计:`);
        console.log(`   总数据包: ${testStats.packets}`);
        console.log(`   打包批次: ${testStats.batches}`);
        console.log(`   总字符数: ${testStats.chars}`);
        console.log(`   耗时: ${duration}ms`);
        
        if (testStats.batches > 0) {
            console.log(`   平均每批次字符数: ${Math.round(testStats.chars / testStats.batches)}`);
            console.log(`   网络请求减少: ${Math.round((1 - testStats.batches / testStats.packets) * 100)}%`);
        }
    }

    printFinalStats() {
        this.stats.endTime = Date.now();
        const totalDuration = this.stats.endTime - this.stats.startTime;
        
        console.log('\n🎯 总体测试结果');
        console.log('='.repeat(60));
        console.log(`总测试时间: ${totalDuration}ms`);
        console.log(`总数据包: ${this.stats.totalPackets}`);
        console.log(`打包数据包: ${this.stats.batchPackets}`);
        console.log(`普通数据包: ${this.stats.normalPackets}`);
        console.log(`总字符数: ${this.stats.totalChars}`);
        console.log(`打包字符数: ${this.stats.totalBatchChars}`);
        
        if (this.stats.batches.length > 0) {
            const avgBatchSize = this.stats.batches.reduce((sum, b) => sum + b.size, 0) / this.stats.batches.length;
            const avgBatchChars = this.stats.batches.reduce((sum, b) => sum + b.chars, 0) / this.stats.batches.length;
            const avgBufferTime = this.stats.batches.reduce((sum, b) => sum + b.time, 0) / this.stats.batches.length;
            
            console.log(`\n📈 打包效果分析:`);
            console.log(`   平均每批次块数: ${avgBatchSize.toFixed(1)}`);
            console.log(`   平均每批次字符数: ${avgBatchChars.toFixed(0)}`);
            console.log(`   平均缓冲时间: ${avgBufferTime.toFixed(0)}ms`);
            console.log(`   网络请求减少率: ${((1 - this.stats.batchPackets / this.stats.totalPackets) * 100).toFixed(1)}%`);
            
            if (this.stats.batchPackets < 10) {
                console.log('\n✅ 打包功能工作正常！成功减少了网络请求次数');
                console.log('🌐 这将显著改善跨洲际网络连接的稳定性');
            } else {
                console.log('\n⚠️  打包效果有限，建议调整缓冲参数');
            }
        } else {
            console.log('\n❌ 未检测到打包数据');
            console.log('💡 请检查:');
            console.log('   - IsDebug 是否设置为 true');
            console.log('   - 缓冲配置是否正确');
            console.log('   - 本地服务器是否正常运行');
        }
    }
}

// 运行测试
const test = new StreamingTest();
test.runTest().catch(console.error);