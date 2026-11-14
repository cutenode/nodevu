const { deepStrictEqual, ok } = require('node:assert');
const { describe, it } = require('node:test');
const fc = require('fast-check');
const { fetch: undiciFetch } = require('undici');
const { DateTime } = require('luxon');
const parseOptions = require('../util/prod/optionsParser');

const defaults = parseOptions();

describe('the parseOptions module should return all correct defaults', async () => {
	it('should return the default date', async () => {
		const now = DateTime.now();
		const defaultParsedOptions = parseOptions({});
		ok(defaultParsedOptions.now instanceof DateTime);
		deepStrictEqual(defaultParsedOptions.now.day, now.day);
		deepStrictEqual(defaultParsedOptions.now.hour, now.hour);
		deepStrictEqual(defaultParsedOptions.now.minute, now.minute);
		deepStrictEqual(defaultParsedOptions.now.month, now.month);
	});

	it('defaultParsedOptions.fetch should be globalThis.fetch when no options are passed', async () => {
		const defaultParsedOptions = parseOptions({});
		deepStrictEqual(defaultParsedOptions.fetch, globalThis.fetch);
	});

	it('should return the origin index.json for url.index', async () => {
		const defaultParsedOptions = parseOptions({});
		deepStrictEqual(
			defaultParsedOptions.urls.index,
			'https://nodejs.org/dist/index.json',
		);
	});

	it('should return the origin schedule.json for url.schedule', async () => {
		const defaultParsedOptions = parseOptions({});
		deepStrictEqual(
			defaultParsedOptions.urls.schedule,
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		);
	});
});

describe('the parseOptions module should still work when defaults are changed', async () => {
	it('should still work when a custom date is passed', async () => {
		const currentNow = DateTime.now();
		const defaultParsedOptions = parseOptions({ now: currentNow });
		deepStrictEqual(defaultParsedOptions.now, currentNow);
	});

	it('defaultParsedOptions.fetch should be globalThis.fetch when no options are passed', async () => {
		const defaultParsedOptions = parseOptions({ fetch: undiciFetch });
		deepStrictEqual(defaultParsedOptions.fetch, undiciFetch);
	});

	it('should return the origin index.json for url.index', async () => {
		const defaultParsedOptions = parseOptions({
			urls: { index: 'https://example.com' },
		});

		deepStrictEqual(defaultParsedOptions.urls.index, 'https://example.com');
	});

	it('should return the origin schedule.json for url.schedule', async () => {
		const defaultParsedOptions = parseOptions({
			urls: { schedule: 'https://example.com' },
		});

		deepStrictEqual(defaultParsedOptions.urls.schedule, 'https://example.com');
	});
});

describe('the parseOptions module should keep every option it is given', async () => {
	it('should take each option that is set, and the default for the rest', async () => {
		// an empty string counts as unset, so it falls back too
		const option = (/** @type {fc.Arbitrary<unknown>} */ value) =>
			fc.option(fc.oneof(value, fc.constant('')), { nil: undefined });

		await fc.assert(
			fc.property(
				fc.record(
					{
						fetch: option(fc.func(fc.anything())),
						now: option(fc.oneof(fc.string(), fc.constant(DateTime.now()))),
						urls: fc.option(
							fc.record(
								{ index: option(fc.webUrl()), schedule: option(fc.webUrl()) },
								{ requiredKeys: [] },
							),
							{ nil: undefined },
						),
					},
					{ requiredKeys: [] },
				),
				(options) => {
					const parsed = parseOptions(
						/** @type {import('../index').Options} */ (options),
					);

					deepStrictEqual(parsed.fetch, options.fetch || defaults.fetch);
					deepStrictEqual(parsed.urls, {
						index: options.urls?.index || defaults.urls.index,
						schedule: options.urls?.schedule || defaults.urls.schedule,
					});

					if (options.now) {
						deepStrictEqual(parsed.now, options.now);
					} else {
						ok(parsed.now instanceof DateTime);
					}
				},
			),
		);
	});
});
