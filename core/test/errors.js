const { rejects } = require('node:assert');
const nodevu = require('../index');
const { describe, it } = require('node:test');

describe('errors while building the data', async () => {
	it('should reject when index.json has a version that cannot be parsed', async () => {
		const index = [{ version: 'not-a-version', files: [] }];

		/** @type {typeof globalThis.fetch} */
		const fetch = async (url) =>
			Response.json(String(url).endsWith('schedule.json') ? {} : index);

		await rejects(nodevu({ fetch, now: '2024-01-01T00:00:00.000Z' }));
	});
});
