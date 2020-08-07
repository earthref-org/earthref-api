import { Context as OpenAPIContext } from 'openapi-backend/backend';
import Koa from 'koa';

export default {
	getHealthCheck: async (c: OpenAPIContext, ctx: Koa.Context) => {
		try {
			const healthy: boolean = true; //await esCheckConnection();
			ctx.status = healthy ? 200 : 500;
		} catch (e) {
			ctx.app.emit('error', e, ctx);
		}
	},
};
