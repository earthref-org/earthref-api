import Koa from 'koa';
import KoaBodyparser from 'koa-bodyparser';
import json from 'koa-json';
import logger from 'koa-logger';
import next from 'next';
import OpenAPIBackend from 'openapi-backend';
import { Context as OpenAPIContext } from 'openapi-backend/backend';
import { createReadStream } from 'fs';

import root from './paths/root';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const v = 'v1';

app.prepare().then(() => {
	
	const server = new OpenAPIBackend({
	definition: `public/${v}/openapi.yaml`,
	handlers: {
		...root,
		validationFail: async (c: OpenAPIContext, ctx: Koa.Context) => {
		ctx.status = 400;
		ctx.body = { err: c.validation.errors };
		},
		notFound: async (c: OpenAPIContext, ctx: Koa.Context) => {
		const { url } = ctx.request;
		if (url === '/' || url === '/index.html') {
			ctx.redirect(`/${v}`);
		} else if (url === `/${v}` || url === `/${v}/` || url === `/${v}/index.html`) {
			ctx.type = 'text/html; charset=utf-8';
			ctx.body = createReadStream(`public/${v}/index.html`);
		} else if (url === '/openapi.yaml' || url === `/${v}/openapi.yaml`) {
			ctx.type = 'text/plain; charset=utf-8';
			ctx.body = createReadStream(`public/${v}/openapi.yaml`);
		} else if (url === '/favicon.ico') {
			ctx.type = 'image/x-icon';
			ctx.body = createReadStream(`public/favicon.ico`);
		} else {
			ctx.status = 404;
			ctx.body = {
			err: `Path '${ctx.request.path}' is not defined for this API. `
				+ 'See https://api.earthref.org for more information.',
			};
		}
		},
		notImplemented: async (c: OpenAPIContext, ctx: Koa.Context) => {
		const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
		ctx.status = status;
		ctx.body = mock;
		},
	},
	ajvOpts: {
		schemaId: 'auto',
	},
	});
	server.init();

	const API = new Koa();

	// Return JSON errors
	API.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500;
		ctx.body = {
		status: ctx.status,
		err: err.message,
		};
		ctx.app.emit('error', err, ctx);
	}
	});
	API.on('error', (err, ctx) => {
	console.error(ctx.request, err);
	});

	// Serve API endpoints
	API.use(KoaBodyparser({}));

	// Log requests
	if (dev) API.use(logger());

	// Pretty print JSON output
	API.use(json({}));

	// Use API as Koa middleware
	API.use((ctx) => server.handleRequest(
	{
		method: ctx.request.method,
		path: ctx.request.path,
		//body: ctx.request.body,
		query: ctx.request.query,
		headers: ctx.request.headers,
	},
	ctx,
	));
	API.listen(port, () => {
	console.log('EarthRef API is listening on port:', port);
  })
});