const assert = require('node:assert');
const ranges = require('../index');
const { describe, it } = require('test');

describe('check some values we know should exist', async () => {
	it('should include some known, static values in "all"', async () => {
		const data = await ranges();
		assert.deepStrictEqual(data.all.versions.includes('v19.0.0'), true); // a semver major we know exists
		assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true); // an LTS release we know happened
		assert.deepStrictEqual(data.all.versions.includes('v0.1.14'), true); // oldest included data in the array - this is the correct oldest data since it's technically the first entry on nodejs.org/dist/index.json
	});

	it('should include some known, static values in "eol"', async () => {
		const data = await ranges();
		assert.deepStrictEqual(data.all.versions.includes('v14.21.0'), true); // an LTS release we know happened
		assert.deepStrictEqual(data.eol.versions.includes('v0.8.0'), true); // oldest included data in the array - this should be fixed since it's clearly not the oldest in the dataset.
	});
});
