const assert = require('node:assert');
const ranges = require('../index');
const { at, versionPattern } = require('./fixtures');
const { describe, it } = require('node:test');

describe('data should exist as it is defined', async () => {
	it('versions should have correct types on every property', async () => {
		const data = await ranges(undefined, at());

		for (const key in data) {
			assert.deepStrictEqual(Array.isArray(data[key].versions), true);
			assert.deepStrictEqual(data[key].versions.length > 0, true);
			assert.deepStrictEqual(
				data[key].versions.every((version) => versionPattern.test(version)),
				true,
			);
		}
	});

	it('both newest and oldest on every property should be the correct type', async () => {
		const data = await ranges(undefined, at());

		for (const key in data) {
			assert.match(data[key].newest, versionPattern);
			assert.match(data[key].oldest, versionPattern);
		}
	});
});
