/**
 * The Node.js release schedule, keyed by release line.
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
 * @param {{ fetch: import('../../index').Fetch, urls: { schedule: string } }} options
 * @returns {Promise<Schedule>}
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
