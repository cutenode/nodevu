/**
 * @file Builds the options `@nodevu/core` takes, filling in a default for each one left out.
 *
 * @example
 * ```js
 * import opt from '@nodevu/opt';
 *
 * const options = opt({ now: '2025-10-30' });
 * ```
 */

const { DateTime } = require('luxon');

/**
 * The part of `fetch` `@nodevu/core` uses: a GET of a URL whose JSON it
 * reads. Any `fetch` with this shape fits, such as `globalThis.fetch` or
 * undici's. A copy of `@nodevu/fetchindex`'s, since opt doesn't depend on it.
 *
 * @public
 * @example
 * ```js
 * import { fetch } from 'undici';
 *
 * const options = opt({ fetch });
 * ```
 *
 * @typedef {(url: string) => Promise<{
 *   ok: boolean,
 *   status: number,
 *   statusText: string,
 *   json: () => Promise<unknown>,
 * }>} Fetch
 */

/**
 * The options `@nodevu/core` takes, with every one set.
 *
 * @public
 * @example
 * ```js
 * const options = opt();
 * options.urls.index; // 'https://nodejs.org/dist/index.json'
 * ```
 *
 * @typedef {object} Options
 * @property {Fetch} fetch The `fetch` implementation to request the data with.
 * @property {string | DateTime} now An ISO 8601 date, or a Luxon `DateTime`.
 * @property {{ index: string, schedule: string }} urls The full URLs of the
 *   release index and release schedule.
 */

// this function allows us to parse user-passed options.
//
// this is particularly useful for tests so we can reduce variables
// and ensure that our test suite is able to be consistent.
/**
 * Builds the options `@nodevu/core` takes, filling in a default for each one
 * left out.
 *
 * @public
 * @example
 * ```js
 * const options = opt({ urls: { index: 'https://example.com/index.json' } });
 *
 * options.urls.index; // 'https://example.com/index.json'
 * options.urls.schedule; // 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json'
 * ```
 *
 * @param {{ fetch?: Fetch, now?: string | DateTime, urls?: { index?: string, schedule?: string } }} [inputOptions]
 *   The caller's options.
 * @returns {Options} The options, each one set.
 */
function opt(inputOptions) {
	// set up our defaults
	/** @type {Options} */
	const result = {
		fetch: globalThis.fetch,
		now: DateTime.now(),
		urls: {
			index: 'https://nodejs.org/dist/index.json',
			schedule:
				'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		},
	};

	if (typeof inputOptions === 'undefined') {
		return result;
	}

	// allow the end-user to replace our fetch implementation with another one they prefer.
	if (inputOptions?.fetch) {
		result.fetch = inputOptions.fetch;
	}

	// allow the end-user to provide a custom DateTime. This is particularly useful for tests.
	if (inputOptions?.now) {
		result.now = inputOptions.now;
	}

	if (inputOptions?.urls?.index) {
		result.urls.index = inputOptions.urls.index;
	}

	if (inputOptions?.urls?.schedule) {
		result.urls.schedule = inputOptions.urls.schedule;
	}

	return result;
}

module.exports = opt;
