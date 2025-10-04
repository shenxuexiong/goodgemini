// 配置文件 - 管理调试模式和缓冲设置

export interface BufferConfig {
    enabled: boolean;           // 是否启用缓冲
    maxChars: number;          // 最大缓冲字符数
    maxChunks: number;         // 最大缓冲块数
    timeoutMs: number;         // 缓冲超时时间（毫秒）
}

export interface DebugConfig {
    isDebug: boolean;          // 是否为调试模式
    logLevel: 'none' | 'basic' | 'verbose';  // 日志级别
    buffer: BufferConfig;      // 缓冲配置
    useProxy: boolean;         // 是否使用代理服务器
    proxyUrl: string;          // 代理服务器地址
}

// 默认配置（开发环境）
export const DEFAULT_CONFIG: DebugConfig = {
    isDebug: true,  // 调试模式开关
    logLevel: 'verbose',
    buffer: {
        enabled: true,
        maxChars: 1000,        // 1000字符触发打包
        maxChunks: 1200,       // 最多1200个块打包
        timeoutMs: 2000        // 2秒超时
    },
    useProxy: true,            // 使用代理服务器
    proxyUrl: 'http://shenxx123.site'  // 你的代理服务器地址
};

// 生产环境配置 - 针对LLM流式响应优化
export const PRODUCTION_CONFIG: DebugConfig = {
    isDebug: false,
    logLevel: 'basic',         // 保留基本日志
    buffer: {
        enabled: true,         // 生产环境启用缓冲打包功能
        maxChars: 1000,        // 1000字符触发打包（3000字分3次发送）
        maxChunks: 1200,       // 最多1200个块打包（应对1包1字的情况）
        timeoutMs: 2000        // 2秒超时（避免等待太久）
    },
    useProxy: false,           // 生产环境直连 Google API
    proxyUrl: ''
};

// 获取当前配置
export function getConfig(): DebugConfig {
    // 检查是否在 Cloudflare Workers 环境中运行
    const isCloudflareWorkers = typeof globalThis !== 'undefined' &&
        (globalThis as any).navigator?.userAgent?.includes('Cloudflare-Workers');

    // 如果在 Cloudflare Workers 中运行，使用生产配置（直连 Google）
    // 如果在本地运行，使用开发配置（通过代理）
    return isCloudflareWorkers ? PRODUCTION_CONFIG : DEFAULT_CONFIG;
}

// 日志工具
export function debugLog(level: 'basic' | 'verbose', message: string, ...args: any[]) {
    const config = getConfig();

    if (!config.isDebug) return;

    if (config.logLevel === 'none') return;
    if (config.logLevel === 'basic' && level === 'verbose') return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
}