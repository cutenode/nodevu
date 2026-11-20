/**
 * @file Fetches the Node.js release schedule from the nodejs/Release repo.
 *
 * @example
 * ```js
 * const scheduleFetcher = require('./util/prod/schedule');
 *
 * const schedule = await scheduleFetcher(optionsParser());
 * ```
 */

/**
 * The Node.js release schedule, keyed by release line.
 *
 * @public
 * @example
 * ```js
 * const schedule = await scheduleFetcher(optionsParser());
 * schedule.v20;
 * // { start: '2023-04-18', lts: '2023-10-24', maintenance: '2024-10-22', end: '2026-04-30', codename: 'Iron' }
 * ```
 *
 * @typedef {Record<string, {
 *   alpha?: string,
 *   start?: string,
 *   lts?: string,
 *   maintenance?: string,
 *   end?: string,
 *   codename?: string,
 * }>} Schedule
 */

/**
 * Fetches the Node.js release schedule. Rejects when the response isn't OK.
 *
 * @public
 * @example
 * ```js
 * const schedule = await scheduleFetcher({
 *   fetch: globalThis.fetch,
 *   urls: { schedule: 'https://raw.githubusercontent.com/nodejs/Release/master/schedule.json' },
 * });
 * schedule.v22.codename; // 'Jod'
 * ```
 *
 * @param {{ fetch: import('../../index').Fetch, urls: { schedule: string } }} options
 *   The `fetch` implementation to use, and the full URL of the schedule.
 * @returns {Promise<Schedule>} The schedule, keyed by release line.
 */
async function schedule(options) {
	// parse our options and set up fetch if a custom fetch is passed
	const fetch = options.fetch;
	const url = options.urls.schedule;

	// fetch the url, get the json from the fetched URL that we're going to use
	const raw = await fetch(url);

	if (!raw.ok) {
		throw new Error(`Fetching ${url} failed: ${raw.status} ${raw.statusText}`);
	}

	// schedule.json is keyed by release line
	const schedule = /** @type {Schedule} */ (await raw.json());

	return schedule;
}

module.exports = schedule;
