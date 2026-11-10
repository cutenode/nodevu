const assert = require('node:assert');
const ranges = require('../index');
const { at, versionPattern } = require('./fixtures');
const { describe, it } = require('node:test');

describe('data should exist as it is defined', async () => {
	it('versions should have correct types on every property', async () => {
		const data = await ranges(undefined, at());

		/** @type {import('@nodevu/aliases').Alias} */
		let key;

		for (key in data) {
			const range = data[key];
			assert.ok(range);
			assert.deepStrictEqual(Array.isArray(range.versions), true);
			assert.deepStrictEqual(range.versions.length > 0, true);
			assert.deepStrictEqual(
				range.versions.every((version) => versionPattern.test(version)),
				true,
			);
		}
	});

	it('both newest and oldest on every property should be the correct type', async () => {
		const data = await ranges(undefined, at());

		/** @type {import('@nodevu/aliases').Alias} */
		let key;

		for (key in data) {
			const range = data[key];
			assert.ok(range?.newest);
			assert.ok(range.oldest);
			assert.match(range.newest, versionPattern);
			assert.match(range.oldest, versionPattern);
		}
	});
});
