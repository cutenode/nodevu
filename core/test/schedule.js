const { match, rejects } = require('node:assert');
const { describe, it } = require('node:test');
const undici = require('undici');
const schedule = require('../util/prod/schedule');
const optionsParser = require('../util/prod/optionsParser');

// undici's types only take its own Request class, so they don't match the
// global fetch's type even though it works as one
const undiciFetch = /** @type {typeof fetch} */ (
	/** @type {unknown} */ (undici.fetch)
);

/** @typedef {import('../util/prod/optionsParser').ParsedOptions} ParsedOptions */

// checks that verify the result of data returned
/** @param {import('../util/prod/schedule').Schedule} data */
function check(data) {
	for (const metadata of Object.values(data)) {
		for (const [metadataKey, metadataValue] of Object.entries(metadata)) {
			// every value is a date except codename, which is empty for
			// release lines that never had LTS
			const valuePattern =
				metadataKey === 'codename' ? /^([A-Z][a-z]+)?$/ : /^\d{4}-\d{2}-\d{2}$/;

			match(metadataValue, valuePattern);
		}
	}
}

// set up options object that would normally be passed to the module. the
// module only reads fetch and its own URL
const options = /** @type {ParsedOptions} */ ({
	fetch: globalThis.fetch,
	urls: {
		schedule:
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
	},
});

describe('under normal condiditons, schedule should work', async () => {
	it('should work with default options', async () => {
		const data = await schedule(options);
		check(data);
	});

	it('should work with Undici fetch', async () => {
		options.fetch = undiciFetch;
		const data = await schedule(options);
		check(data);
	});
});

describe('schedule should work with optionsParser', async () => {
	it('should work with the default output of optionsParser', async () => {
		const parsedOptions = optionsParser({});
		const data = await schedule(parsedOptions);
		check(data);
	});

	it('should work with a different fetch passed to optionsParser', async () => {
		const parsedOptions = optionsParser({
			fetch: undiciFetch,
		});

		const data = await schedule(parsedOptions);
		check(data);
	});
});

describe('schedule', async () => {
	it('should reject naming the URL and status when the response is not ok', async () => {
		// Arrange
		const url =
			'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json';

		// Act
		const result = schedule(
			/** @type {ParsedOptions} */ ({
				fetch: notFound,
				urls: { schedule: url },
			}),
		);

		// Assert
		await rejects(result, {
			message: `Fetching ${url} failed: 404 Not Found`,
		});
	});
});

// Helpers

/** @type {typeof fetch} */
const notFound = async () =>
	new Response('Not Found', { status: 404, statusText: 'Not Found' });
