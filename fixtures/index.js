/**
 * @file Options that point the nodevu packages at the snapshot data, for tests.
 *
 * @example
 * ```js
 * const { at } = require('@nodevu/fixtures');
 * ```
 */

const index = require('./data/index.json');
const schedule = require('./data/schedule.json');

/**
 * Returns options for `@nodevu/core`, and the packages built on it, that serve
 * `data` instead of fetching it. Its index.json only has the releases that
 * were out by `now`, like the real one. Any other URL throws, so tests never
 * touch the network.
 *
 * `now` defaults to 2025-09-01, picked so that current, active LTS,
 * maintenance LTS and end of life each have a release line, and each of those
 * lines already has a security release, so no range or security field is
 * empty.
 *
 * @param {string} [now] The date to serve the data as of, such as
 *   `'2025-09-01'`.
 * @param {{ index: { date: string }[], schedule: unknown }} [data] The
 *   index.json and schedule.json to serve. Defaults to the snapshots.
 * @returns {{ now: string, fetch: typeof fetch }} The `now` and `fetch`
 *   options.
 * @public
 * @example
 * ```js
 * const nodevu = require('@nodevu/core');
 * const { at } = require('@nodevu/fixtures');
 *
 * const data = await nodevu(at('2025-09-01'));
 *
 * data.v22.support.phases.current; // 'lts'
 * ```
 */
function at(now = '2025-09-01', data = { index, schedule }) {
	return {
		now,
		fetch: async (url) => {
			if (String(url).endsWith('/schedule.json')) {
				return Response.json(data.schedule);
			}

			if (String(url).endsWith('/index.json')) {
				return Response.json(data.index.filter((entry) => entry.date <= now));
			}

			throw new Error(`No fixture data for ${url}`);
		},
	};
}

module.exports = { at };
