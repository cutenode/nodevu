const assert = require('node:assert');
const { describe, it } = require('node:test');
const nodevu = require('../index');

describe('files for a release that index.json lists without any', async () => {
	it('should return no available files and no links', async () => {
		const data = await nodevu({
			fetch: async (url) =>
				Response.json(
					url.endsWith('schedule.json')
						? {}
						: [{ version: 'v28.0.0', date: '2028-01-01', lts: false }],
				),
			now: '2028-01-01',
		});

		assert.deepStrictEqual(data.v28.releases['v28.0.0'].files, {
			available: [],
			links: {},
		});
	});
});
