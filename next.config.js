module.exports = {
	async redirects() {
		const versions = 'v1';
		return [
			{ source: '/', destination: `/v1`, permanent: true },
			{
				source: `/:version(${versions})/index.html`,
				destination: `/:version`,
				permanent: true,
			},
			{ source: `/api/:api*`, destination: `/:api`, permanent: true },
		];
	},
	async rewrites() {
		const versions = 'v1';
		const portals = 'MagIC|ERDA';
		return [
			{ source: `/health-check`, destination: `/api/health-check` },
			{ source: `/:version(${versions})`, destination: `/:version/index.html` },
			{
				source: `/:version(${versions})/openapi.yaml`,
				destination: `/:version/openapi.yaml`,
			},
			{
				source: `/:version(${versions})/:portal(${portals})/:path(download)`,
				destination: `/api/:version`,
			},
			{ source: `/:version(${versions})/:other*`, destination: '/api/404' },
		];
	},
};
