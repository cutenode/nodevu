const assert = require('node:assert');
const ranges = require('../index');
const { at } = require('./fixtures');
const { describe, it } = require('node:test');

// tests various values to ensure that the start with the correct character
describe('check that "v"s are where they should (and are not where they should not be)', async () => {
	it('should include the letter v before the strings that should have it', async () => {
		const data = await ranges(undefined, at());

		// loop over all versions arrays in all sets (all,
		// current, lts/latest, lts/active, lts/maintenance,
		// and eol) and check that they all start with a v
		for (const range of Object.values(data)) {
			for (const version of range.versions) {
				assert.deepStrictEqual(version.startsWith('v'), true);
			}

			// all newest and oldest entries should start with v
			assert.ok(range.newest);
			assert.ok(range.oldest);
			assert.deepStrictEqual(range.newest.startsWith('v'), true);
			assert.deepStrictEqual(range.oldest.startsWith('v'), true);
		}

		assert.ok(data.all?.newestLts);
		assert.ok(data.all.newestSecurity);
		assert.deepStrictEqual(data.all.newestLts.startsWith('v'), true);
		assert.deepStrictEqual(data.all.newestSecurity.startsWith('v'), true);
	});

	// this probably needs to be fixed. It's a bug in core and it trickles down to ranges.
	it('is missing the letter v where it should not be... for now', async () => {
		const data = await ranges(undefined, at());
		assert.ok(data.current?.oldestSecurity);
		assert.ok(data.current.newestSecurity);
		assert.ok(data['lts/latest']?.oldestLts);
		assert.ok(data['lts/latest'].oldestSecurity);
		assert.ok(data['lts/latest'].newestLts);
		assert.ok(data['lts/latest'].newestSecurity);
		assert.ok(data['lts/active']?.oldestLts);
		assert.ok(data['lts/active'].oldestSecurity);
		assert.ok(data['lts/active'].newestLts);
		assert.ok(data['lts/active'].newestSecurity);
		assert.ok(data['lts/maintenance']?.oldestLts);
		assert.ok(data['lts/maintenance'].oldestSecurity);
		assert.ok(data['lts/maintenance'].newestLts);
		assert.ok(data['lts/maintenance'].newestSecurity);

		assert.deepStrictEqual(data.current.oldestSecurity.startsWith('v'), false);
		assert.deepStrictEqual(data.current.newestSecurity.startsWith('v'), false);

		assert.deepStrictEqual(data['lts/latest'].oldestLts.startsWith('v'), false);
		assert.deepStrictEqual(
			data['lts/latest'].oldestSecurity.startsWith('v'),
			false,
		);
		assert.deepStrictEqual(data['lts/latest'].newestLts.startsWith('v'), false);
		assert.deepStrictEqual(
			data['lts/latest'].newestSecurity.startsWith('v'),
			false,
		);

		assert.deepStrictEqual(data['lts/active'].oldestLts.startsWith('v'), false);
		assert.deepStrictEqual(
			data['lts/active'].oldestSecurity.startsWith('v'),
			false,
		);
		assert.deepStrictEqual(data['lts/active'].newestLts.startsWith('v'), false);
		assert.deepStrictEqual(
			data['lts/active'].newestSecurity.startsWith('v'),
			false,
		);

		assert.deepStrictEqual(
			data['lts/maintenance'].oldestLts.startsWith('v'),
			false,
		);
		assert.deepStrictEqual(
			data['lts/maintenance'].oldestSecurity.startsWith('v'),
			false,
		);
		assert.deepStrictEqual(
			data['lts/maintenance'].newestLts.startsWith('v'),
			false,
		);
		assert.deepStrictEqual(
			data['lts/maintenance'].newestSecurity.startsWith('v'),
			false,
		);
	});
});
