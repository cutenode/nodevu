const assert = require('node:assert');
const translate = require('../index');
const ranges = require('@nodevu/ranges');
const { describe, it } = require('node:test');
const { at } = require('../../ranges/test/fixtures');

// serve core's snapshot data at a fixed date so results don't depend on
// nodejs.org or today's date
const options = at();

describe('test that each alias works with @nodevu/ranges', async () => {
	it('should return the same result when both the translated and untranslated "current" are passed to @nodevu/ranges', async () => {
		const untranslated = await ranges('current', options);
		const translated = await ranges(await translate('current'), options);

		assert.deepStrictEqual(untranslated, translated);
	});

	it('should return the same result when "lts/latest" and the translated "lts_latest" are passed to @nodevu/ranges', async () => {
		const untranslated = await ranges('lts/latest', options);
		const translated = await ranges(await translate('lts_latest'), options);

		assert.deepStrictEqual(untranslated, translated);
	});

	it('should return the same result when "lts/active" and "lts/maintenance" and the translated "lts" are passed to @nodevu/ranges', async () => {
		const untranslated = await ranges(
			['lts/active', 'lts/maintenance'],
			options,
		);

		const translated = await ranges(await translate('lts'), options);

		assert.deepStrictEqual(untranslated, translated);
	});

	it('should return the same result when "current", "lts/active", and "lts/maintenance" and the translated "supported" are passed to @nodevu/ranges', async () => {
		const untranslated = await ranges(
			['current', 'lts/active', 'lts/maintenance'],
			options,
		);

		const translated = await ranges(await translate('supported'), options);

		assert.deepStrictEqual(untranslated, translated);
	});

	it('should return the same result when "current", "lts/active", "lts/maintenance", and "eol" and the translated "all" are passed to @nodevu/ranges', async () => {
		const untranslated = await ranges(
			['current', 'lts/active', 'lts/maintenance', 'eol'],
			options,
		);

		const translated = await ranges(await translate('all'), options);

		assert.deepStrictEqual(untranslated, translated);
	});
});
