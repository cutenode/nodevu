/**
 * @file Fills in the defaults for the options `@nodevu/core` takes.
 *
 * @example
 * ```js
 * const optionsParser = require('./util/prod/optionsParser');
 *
 * const parsedOptions = optionsParser({ now: '2025-10-30' });
 * ```
 */

const { DateTime } = require('luxon');

/**
 * Core's options with every default filled in, so nothing downstream checks for a missing one.
 *
 * @public
 * @example
 * ```js
 * const { urls } = optionsParser();
 * urls.index; // 'https://nodejs.org/dist/index.json'
 * ```
 *
 * @typedef {object} ParsedOptions
 * @property {import('../../index').Fetch} fetch The `fetch` implementation to
 *   request the data with.
 * @property {string | DateTime} now The date to work out each release line's
 *   phase against.
 * @property {{ index: string, schedule: string }} urls The full URLs of the
 *   release index and release schedule.
 */

// this function allows us to parse user-passed options.
//
// this is particularly useful for tests so we can reduce variables
// and ensure that our test suite is able to be consistent.
/**
 * Fills in a default for each option the caller left out.
 *
 * @public
 * @example
 * ```js
 * const parsedOptions = optionsParser({ now: '2025-10-30' });
 *
 * parsedOptions.now; // '2025-10-30'
 * parsedOptions.fetch === globalThis.fetch; // true
 * ```
 *
 * @param {import('../../index').Options} [options] The caller's options.
 * @returns {ParsedOptions} The options, each one set.
 */
function parseOptions(options) {
	// set up our defaults
	/** @type {ParsedOptions} */
	const parsedOptions = {
		fetch: globalThis.fetch,
		now: DateTime.now(),
		urls: {
			index: 'https://nodejs.org/dist/index.json',
			schedule:
				'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json',
		},
	};

	// allow the end-user to replace our fetch implementation with another one they prefer.
	if (options?.fetch) {
		parsedOptions.fetch = options.fetch;
	}

	// allow the end-user to provide a custom DateTime. This is particularly useful for tests.
	if (options?.now) {
		parsedOptions.now = options.now;
	}

	if (options?.urls?.index) {
		parsedOptions.urls.index = options.urls.index;
	}

	if (options?.urls?.schedule) {
		parsedOptions.urls.schedule = options.urls.schedule;
	}

	return parsedOptions;
}

module.exports = parseOptions;
