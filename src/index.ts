import { Hono } from 'hono';
import { Render } from './render';
import { LoadBalancer } from './handler';
import { getAuthKey } from './auth';
import { getCookie, setCookie } from 'hono/cookie';

const app = new Hono<{ Bindings: Env }>();
//触发部署！！！！！！新版本2024
// 重新部署以应用Cloudflare全局变量配置 - 2024年10月
// 管理页面访问，校验 HOME_ACCESS_KEY
app.get('/', (c) => {
	const sessionKey = getCookie(c, 'auth-key');
	const authKey = getAuthKey(c.req.raw, sessionKey);
	if (authKey !== c.env.HOME_ACCESS_KEY) {
		return c.html(Render({ isAuthenticated: false, showWarning: false }));
	}
	const showWarning =
		c.env.HOME_ACCESS_KEY === 'your-home-access-key-here' ||
		c.env.AUTH_KEY === 'your-auth-key-here' ||
		!c.env.HOME_ACCESS_KEY ||
		!c.env.AUTH_KEY;
	return c.html(Render({ isAuthenticated: true, showWarning }));
});

// 登录接口，校验 HOME_ACCESS_KEY，登录成功后写入 cookie
app.post('/', async (c) => {
	const { key } = await c.req.json();
	if (key === c.env.HOME_ACCESS_KEY) {
		setCookie(c, 'auth-key', key, { maxAge: 60 * 60 * 24 * 30, path: '/' });
		return c.json({ success: true });
	}
	return c.json({ success: false }, 401);
});

// 静态资源放行
app.get('/favicon.ico', async (c) => {
	return c.text('Not found', 404);
});

// 其它请求转发到 Durable Object
app.all('*', async (c) => {
	const id: DurableObjectId = c.env.LOAD_BALANCER.idFromName('loadbalancer');
	const stub = c.env.LOAD_BALANCER.get(id, { locationHint: 'wnam' });
	const resp = await stub.fetch(c.req.raw);
	return new Response(resp.body, {
		status: resp.status,
		headers: resp.headers,
	});
});

type Env = {
	LOAD_BALANCER: DurableObjectNamespace<LoadBalancer>;
	AUTH_KEY?: string;
	HOME_ACCESS_KEY: string;
	FORWARD_CLIENT_KEY_ENABLED: string;
	GOOGLE_API_KEY?: string;
	// 缓冲配置环境变量
	BUFFER_MAX_CHARS?: string;     // 最大缓冲字符数，默认2000
	BUFFER_MAX_CHUNKS?: string;    // 最大缓冲块数，默认100
	BUFFER_TIMEOUT_MS?: string;    // 缓冲超时时间(毫秒)，默认3000
};

export default {
	fetch: app.fetch,
};

export { LoadBalancer };

// 部署时间戳: 2024-10-04 - 应用新的环境变量配置
