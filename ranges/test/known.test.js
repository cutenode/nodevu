const assert = require('node:assert');
const ranges = require('../index');
const { at } = require('./fixtures');
const { describe, it } = require('node:test');

describe('check some values we know should exist', async () => {
	it('should include some known, static values in "all"', async () => {
		const data = await ranges(undefined, at());
		assert.deepStrictEqual(data.all.versions.includes('v19.0.0'), true); // a semver major we know exists
		assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true); // an LTS release we know happened
		assert.deepStrictEqual(data.all.versions.includes('v0.1.14'), true); // oldest included data in the array - this is the correct oldest data since it's technically the first entry on nodejs.org/dist/index.json
	});

	it('should include some known, static values in "eol"', async () => {
		const data = await ranges(undefined, at());
		assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true); // an LTS release we know happened
		assert.deepStrictEqual(data.eol.versions.includes('v0.8.0'), true); // oldest included data in the array - this should be fixed since it's clearly not the oldest in the dataset.
	});

	// pins every range's values on the fixture date, so a release line that
	// lands in the wrong range fails
	it('should put each release line in the right range', async () => {
		const data = await ranges(undefined, at());

		const summary = Object.fromEntries(
			Object.entries(data).map(([alias, { versions, ...range }]) => [
				alias,
				range,
			]),
		);

		assert.deepStrictEqual(summary, {
			all: {
				newestLts: 'v22.19.0',
				newestSecurity: 'v24.4.1',
				newest: 'v24.7.0',
				oldest: 'v0.1.14',
			},
			current: {
				oldestSecurity: '24.0.2',
				newestSecurity: '24.4.1',
				newest: 'v24.7.0',
				oldest: 'v24.0.0',
			},
			'lts/latest': {
				oldestLts: '22.11.0',
				oldestSecurity: '22.4.1',
				newestLts: '22.19.0',
				newestSecurity: '22.17.1',
				newest: 'v22.19.0',
				oldest: 'v22.11.0',
			},
			'lts/active': {
				oldestLts: '20.9.0',
				oldestSecurity: '20.3.1',
				newestLts: '22.19.0',
				newestSecurity: '22.17.1',
				newest: 'v22.19.0',
				oldest: 'v20.9.0',
			},
			'lts/maintenance': {
				oldestLts: '20.9.0',
				oldestSecurity: '20.3.1',
				newestLts: '20.19.4',
				newestSecurity: '20.19.4',
				newest: 'v20.19.4',
				oldest: 'v20.9.0',
			},
			eol: {
				newest: 'v23.11.1',
				oldest: 'v0.8.0',
			},
		});
	});
});
