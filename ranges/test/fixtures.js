const index = require('../../core/test/data/static/index.json');
const schedule = require('../../core/test/data/static/schedule.json');

// the default date for tests. it's picked so that current, active LTS,
// maintenance LTS and end of life each have a release line, and each of those
// lines already has a security release, so no range or security field is
// empty.
const now = '2025-09-01';

// every version in index.json, like v22.19.0
const versionPattern = /^v\d+\.\d+\.\d+$/;

// returns options for `ranges` that serve `data` (core's index.json and
// schedule.json snapshots by default) instead of fetching them, only including
// releases that would be out by `now`, like the real index.json. any other URL
// throws, so tests never touch the network.
function at(date = now, data = { index, schedule }) {
	return {
		now: date,
		fetch: async (url) => {
			if (url.endsWith('/schedule.json')) {
				return Response.json(data.schedule);
			}

			if (url.endsWith('/index.json')) {
				return Response.json(data.index.filter((entry) => entry.date <= date));
			}

			throw new Error(`No fixture data for ${url}`);
		},
	};
}

module.exports = { at, versionPattern };
