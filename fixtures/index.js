const index = require('./data/index.json');
const schedule = require('./data/schedule.json');

/**
 * Returns options for @nodevu/core (and the packages built on it) that serve
 * `data` (the index.json and schedule.json snapshots by default) instead of
 * fetching them, only including releases that were out by `now`, like the
 * real index.json. Any other URL throws, so tests never touch the network.
 *
 * `now` defaults to 2025-09-01, picked so that current, active LTS,
 * maintenance LTS and end of life each have a release line, and each of those
 * lines already has a security release, so no range or security field is
 * empty.
 *
 * @param {string} [now]
 * @param {{ index: { date: string }[], schedule: unknown }} [data]
 * @returns {{ now: string, fetch: typeof fetch }}
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
