const assert = require('node:assert');
const ranges = require('../index');
const { describe, it } = require('test');

// tests various values to ensure that the start with the correct character
describe('check that "v"s are where they should (and are not where they should not be)', async () => {
	it('should include the letter v before the strings that should have it', async () => {
		const data = await ranges();

		// loop over all versions arrays in all sets (all,
		// current, lts/latest, lts/active, lts/maintenance,
		// and eol) and check that they all start with a v
		for (const entry in data) {
			for (const version in data[entry].versions) {
				assert.deepStrictEqual(
					data[entry].versions[version].startsWith('v'),
					true,
				);
			}

			// all newest and oldest entries should start with v
			assert.deepStrictEqual(data[entry].newest.startsWith('v'), true);
			assert.deepStrictEqual(data[entry].oldest.startsWith('v'), true);
		}

		assert.deepStrictEqual(data.all.newestLts.startsWith('v'), true);
		assert.deepStrictEqual(data.all.newestSecurity.startsWith('v'), true);
	});

	// this probably needs to be fixed. It's a bug in core and it trickles down to ranges.
	it('is missing the letter v where it should not be... for now', async () => {
		const data = await ranges();
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
