const { deepStrictEqual } = require('node:assert');
const { describe, it } = require('node:test');
const { fetch: undiciFetch } = require('undici');
const { DateTime } = require('luxon');
const opt = require('../index');

describe('the parseOptions module should return all correct defaults', async () => {
	it('should return the default date', async () => {
		const now = DateTime.now();
		const defaultParsedOptions = opt();
		deepStrictEqual(defaultParsedOptions.now.day, now.day);
		deepStrictEqual(defaultParsedOptions.now.hour, now.hour);
		deepStrictEqual(defaultParsedOptions.now.minute, now.minute);
		deepStrictEqual(defaultParsedOptions.now.month, now.month);
	});

	it('should return the default date, when options is an empty object', async () => {
		const now = DateTime.now();
		const defaultParsedOptions = opt({});
		deepStrictEqual(defaultParsedOptions.now.day, now.day);
		deepStrictEqual(defaultParsedOptions.now.hour, now.hour);
		deepStrictEqual(defaultParsedOptions.now.minute, now.minute);
		deepStrictEqual(defaultParsedOptions.now.month, now.month);
	});

	it('defaultParsedOptions.fetch should be globalThis.fetch when no options are passed', async () => {
		const defaultParsedOptions = opt();
		deepStrictEqual(defaultParsedOptions.fetch, globalThis.fetch);
	});

	it('should return the origin index.json for url.index', async () => {
		const defaultParsedOptions = opt();
		deepStrictEqual(
			defaultParsedOptions.urls.index,
			'https://nodejs.org/dist/index.json',
		);
	});

	it('should return the origin schedule.json for url.schedule', async () => {
		const defaultParsedOptions = opt();
		deepStrictEqual(
			defaultParsedOptions.urls.schedule,
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		);
	});
});

describe('the parseOptions module should still work when defaults are changed', async () => {
	it('should still work when a custom date is passed', async () => {
		const currentNow = DateTime.now();
		const defaultParsedOptions = opt({ now: currentNow });
		deepStrictEqual(defaultParsedOptions.now, currentNow);
	});

	it('defaultParsedOptions.fetch should be globalThis.fetch when no options are passed', async () => {
		const defaultParsedOptions = opt({ fetch: undiciFetch });
		deepStrictEqual(defaultParsedOptions.fetch, undiciFetch);
	});

	it('should return the origin index.json for url.index', async () => {
		const defaultParsedOptions = opt({
			urls: { index: 'https://example.com' },
		});
		deepStrictEqual(defaultParsedOptions.urls.index, 'https://example.com');
	});

	it('should return the origin schedule.json for url.schedule', async () => {
		const defaultParsedOptions = opt({
			urls: { schedule: 'https://example.com' },
		});
		deepStrictEqual(defaultParsedOptions.urls.schedule, 'https://example.com');
	});
});
