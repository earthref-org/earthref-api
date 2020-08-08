import { describe, beforeAll, it, expect } from '@jest/globals';
import axios, { AxiosInstance } from 'axios';

describe('Home page', () => {
	let client: AxiosInstance;

	beforeAll(async () => {
		client = axios.create({
			baseURL: `http://localhost:3000`,
			validateStatus: () => true,
		});
	});

	it('GET /health-check returns 200 OK', async () => {
		const res = await client.get('/health-check', {
			headers: { Accept: 'text/plain' },
		});
		expect(res.status).toBe(200);
	});
});
